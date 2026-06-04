"""Telegram bot — arizalar va chat uchun"""
import asyncio
import logging
from aiogram import Bot, Dispatcher, F
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.filters import Command, CommandStart
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.types import (
    Message, InlineKeyboardButton, InlineKeyboardMarkup,
    KeyboardButton, ReplyKeyboardMarkup, ReplyKeyboardRemove,
)

from app.core.config import settings

log = logging.getLogger("basalt.bot")

# Global bot va dispatcher (agar TOKEN bo'lsa)
bot: Bot | None = None
dp: Dispatcher | None = None


class ApplicationForm(StatesGroup):
    name = State()
    phone = State()
    product = State()
    message = State()


def get_main_keyboard():
    return ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="📝 Ariza qoldirish"), KeyboardButton(text="📦 Mahsulotlar")],
            [KeyboardButton(text="📞 Aloqa"), KeyboardButton(text="ℹ️ Biz haqimizda")],
        ],
        resize_keyboard=True,
    )


def register_handlers(dp: Dispatcher):
    @dp.message(CommandStart())
    async def start(message: Message):
        text = (
            "👋 Assalomu alaykum!\n\n"
            "<b>Basalt UZ</b> botiga xush kelibsiz.\n\n"
            "Bizning kompaniya sendvich panellar va bazalt izolyatsiya ishlab chiqaradi.\n\n"
            "Quyidagi tugmalardan birini tanlang 👇"
        )
        await message.answer(text, reply_markup=get_main_keyboard())

    @dp.message(F.text == "📝 Ariza qoldirish")
    async def apply_start(message: Message, state: FSMContext):
        await state.set_state(ApplicationForm.name)
        await message.answer(
            "Ismingizni kiriting:",
            reply_markup=ReplyKeyboardRemove(),
        )

    @dp.message(ApplicationForm.name)
    async def apply_name(message: Message, state: FSMContext):
        await state.update_data(name=message.text)
        await state.set_state(ApplicationForm.phone)
        await message.answer(
            "📞 Telefon raqamingizni kiriting:\n(masalan: +998 90 123 45 67)",
            reply_markup=ReplyKeyboardMarkup(
                keyboard=[[KeyboardButton(text="📱 Raqamni yuborish", request_contact=True)]],
                resize_keyboard=True, one_time_keyboard=True,
            ),
        )

    @dp.message(ApplicationForm.phone, F.contact)
    async def apply_phone_contact(message: Message, state: FSMContext):
        await state.update_data(phone=message.contact.phone_number)
        await ask_product(message, state)

    @dp.message(ApplicationForm.phone)
    async def apply_phone_text(message: Message, state: FSMContext):
        await state.update_data(phone=message.text)
        await ask_product(message, state)

    async def ask_product(message: Message, state: FSMContext):
        await state.set_state(ApplicationForm.product)
        kb = InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="Sendvich panellar", callback_data="prod:sandwich")],
            [InlineKeyboardButton(text="Bazalt izolyatsiya", callback_data="prod:insulation")],
            [InlineKeyboardButton(text="Bazalt tola", callback_data="prod:fiber")],
            [InlineKeyboardButton(text="Boshqa / Aniq emas", callback_data="prod:other")],
        ])
        await message.answer(
            "Qaysi mahsulotga qiziqasiz?",
            reply_markup=kb,
        )

    @dp.callback_query(F.data.startswith("prod:"))
    async def apply_product(callback, state: FSMContext):
        product_map = {
            "sandwich": "Sendvich panellar",
            "insulation": "Bazalt izolyatsiya",
            "fiber": "Bazalt tola",
            "other": "Aniq emas",
        }
        product = product_map.get(callback.data.split(":")[1], "Boshqa")
        await state.update_data(product=product)
        await state.set_state(ApplicationForm.message)
        await callback.message.edit_text(
            f"✅ Tanlandi: <b>{product}</b>\n\n"
            "Qo'shimcha izoh yoki savol yozing (yoki 'yo'q' deb yuboring):",
        )
        await callback.answer()

    @dp.message(ApplicationForm.message)
    async def apply_finish(message: Message, state: FSMContext):
        data = await state.get_data()
        msg_text = message.text if message.text and message.text.lower() != "yo'q" else None

        # DB'ga saqlash
        from app.core.database import AsyncSessionLocal
        from app.models.application import Application
        async with AsyncSessionLocal() as db:
            app_obj = Application(
                name=data.get("name", "Anonim"),
                phone=data.get("phone", "-"),
                product_interest=data.get("product"),
                message=msg_text,
                source="telegram",
                extra_data={"telegram_user_id": message.from_user.id,
                            "telegram_username": message.from_user.username},
            )
            db.add(app_obj)
            await db.commit()
            await db.refresh(app_obj)

        await state.clear()
        await message.answer(
            "✅ <b>Arizangiz qabul qilindi!</b>\n\n"
            f"Ismingiz: {data.get('name')}\n"
            f"Telefon: {data.get('phone')}\n"
            f"Mahsulot: {data.get('product')}\n\n"
            "Tez orada operatorlarimiz siz bilan bog'lanadi 🙏",
            reply_markup=get_main_keyboard(),
        )

        # Admin chatga xabar yuborish
        if settings.TELEGRAM_ADMIN_CHAT_ID:
            admin_text = (
                "🔔 <b>Yangi ariza (Telegram bot)</b>\n\n"
                f"👤 <b>Ism:</b> {data.get('name')}\n"
                f"📞 <b>Telefon:</b> {data.get('phone')}\n"
                f"📦 <b>Mahsulot:</b> {data.get('product')}\n"
            )
            if msg_text:
                admin_text += f"💬 <b>Izoh:</b> {msg_text}\n"
            admin_text += f"\n🆔 #ariza_{app_obj.id}"
            try:
                await bot.send_message(settings.TELEGRAM_ADMIN_CHAT_ID, admin_text)
            except Exception as e:
                log.warning(f"Admin chatga yuborib bo'lmadi: {e}")

    @dp.message(F.text == "📦 Mahsulotlar")
    async def show_products(message: Message):
        text = (
            "🏗 <b>Bizning mahsulotlar:</b>\n\n"
            "🔹 <b>Sendvich panellar</b> — tom va devor uchun, bazalt tola yadrosi bilan\n\n"
            "🔹 <b>Bazalt izolyatsiya</b> — silindr, plita, mat shaklida\n\n"
            "🔹 <b>Bazalt tola</b> — roving, mato, geomash\n\n"
            "🔹 <b>Aksessuarlar</b> — vintlar, profillar\n\n"
            "Batafsil ma'lumot uchun saytimizga kiring yoki ariza qoldiring."
        )
        await message.answer(text)

    @dp.message(F.text == "📞 Aloqa")
    async def show_contacts(message: Message):
        text = (
            "📞 <b>Bog'lanish:</b>\n\n"
            "☎️ Tel: +998 90 123 45 67\n"
            "📧 Email: info@basalt.uz\n"
            "📍 Manzil: Toshkent, Yangihayot tumani\n"
            "🕐 Ish vaqti: Du-Sh 9:00–18:00\n\n"
            "🌐 Website: https://basalt.uz"
        )
        await message.answer(text)

    @dp.message(F.text == "ℹ️ Biz haqimizda")
    async def about(message: Message):
        await message.answer(
            "🪨 <b>Basalt UZ</b>\n\n"
            "10+ yillik tajribaga ega yetakchi ishlab chiqaruvchimiz. "
            "Bizning mahsulotlar O'zbekiston bo'yicha minglab loyihalarda ishlatilgan.\n\n"
            "✅ Yong'inga chidamli\n"
            "✅ Ekologik toza\n"
            "✅ Yuqori sifat\n"
            "✅ Tezkor yetkazib berish"
        )

    @dp.message(Command("cancel"))
    async def cancel(message: Message, state: FSMContext):
        await state.clear()
        await message.answer("Bekor qilindi.", reply_markup=get_main_keyboard())


async def start_bot():
    """Botni ishga tushirish — agar token bo'lmasa o'tkazib yuboriladi"""
    global bot, dp
    if not settings.TELEGRAM_BOT_TOKEN:
        log.warning("⚠️  TELEGRAM_BOT_TOKEN o'rnatilmagan — bot ishlamaydi")
        return

    try:
        bot = Bot(
            token=settings.TELEGRAM_BOT_TOKEN,
            default=DefaultBotProperties(parse_mode=ParseMode.HTML),
        )
        dp = Dispatcher(storage=MemoryStorage())
        register_handlers(dp)
        log.info("🤖 Telegram bot ishga tushirildi")
        await dp.start_polling(bot, handle_signals=False)
    except Exception as e:
        log.error(f"Bot xatosi: {e}")


async def stop_bot():
    global bot, dp
    if dp:
        try:
            await dp.stop_polling()
        except Exception:
            pass
    if bot:
        try:
            await bot.session.close()
        except Exception:
            pass


# ─────────── External helpers — ariza va chatni botga yuborish ───────────
async def send_application_to_telegram(app_obj):
    """Saytdan kelgan arizani admin chatga yuborish"""
    if not bot or not settings.TELEGRAM_ADMIN_CHAT_ID:
        return
    text = (
        "🔔 <b>Yangi ariza (sayt)</b>\n\n"
        f"👤 <b>Ism:</b> {app_obj.name}\n"
        f"📞 <b>Telefon:</b> {app_obj.phone}\n"
    )
    if app_obj.email:
        text += f"📧 <b>Email:</b> {app_obj.email}\n"
    if app_obj.company:
        text += f"🏢 <b>Kompaniya:</b> {app_obj.company}\n"
    if app_obj.product_interest:
        text += f"📦 <b>Mahsulot:</b> {app_obj.product_interest}\n"
    if app_obj.message:
        text += f"💬 <b>Xabar:</b> {app_obj.message}\n"
    text += f"\n🆔 #ariza_{app_obj.id}"
    try:
        await bot.send_message(settings.TELEGRAM_ADMIN_CHAT_ID, text)
    except Exception as e:
        log.warning(f"Telegramga yuborib bo'lmadi: {e}")


async def send_chat_message_to_telegram(chat_sess, msg):
    """Chat xabarini admin chatga yuborish"""
    if not bot or not settings.TELEGRAM_ADMIN_CHAT_ID:
        return
    name = chat_sess.name or "Anonim"
    phone = chat_sess.phone or "—"
    text = (
        f"💬 <b>Yangi chat xabar</b>\n"
        f"👤 {name} | 📞 {phone}\n"
        f"🆔 {chat_sess.session_id[:8]}\n\n"
        f"<i>{msg.text}</i>"
    )
    try:
        await bot.send_message(settings.TELEGRAM_ADMIN_CHAT_ID, text)
    except Exception as e:
        log.warning(f"Chat xabarini yuborib bo'lmadi: {e}")
