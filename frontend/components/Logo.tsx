type LogoProps = {
  size?: number;
  className?: string;
};

// ECO BASALT logo — transparent PNG (faqat ikon)
export default function Logo({ size = 48, className = "" }: LogoProps) {
  return (
    <img
      src="/logo.png?v=4"
      alt="ECO BASALT"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: "contain", background: "transparent" }}
    />
  );
}
