/** Petite tête de renard dans le style des illustrations du site (tracée d'après fox_2.png). */
export function FoxHead({ size = "1em", title }: { size?: string | number; title?: string }) {
  return (
    <svg
      viewBox="730 285 641 535"
      width={size}
      height={size}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className="fox-head"
    >
      <path d="M818 292L983 437L848 560Q818 430 818 292Z" fill="#E4742B" />
      <path d="M835 337Q900 425 947 468L880 530Q852 450 835 337Z" fill="#281E1E" />
      <path d="M1283 292L1119 437L1254 560Q1283 430 1283 292Z" fill="#E4742B" />
      <path d="M1266 337Q1201 425 1155 468L1222 530Q1249 450 1266 337Z" fill="#281E1E" />
      {/* Fond crème sous le museau : bouche les interstices entre les joues et la mâchoire. */}
      <polygon points="735,662 1366,662 1080,815 1023,815" fill="#F9F6E3" />
      <polygon points="983,437 1051,437 1051,760 1028,766 995,660 968,613 912,598 862,634 735,662" fill="#EE973B" />
      <polygon points="1119,437 1051,437 1051,760 1074,766 1107,660 1133,613 1190,598 1240,634 1366,662" fill="#E4742B" />
      <polygon points="862,634 912,598 938,643 995,660 1028,766 980,700" fill="#C24F2E" />
      <polygon points="1240,634 1190,598 1164,643 1107,660 1074,766 1122,700" fill="#C24F2E" />
      <polygon points="912,598 968,613 984,630 995,660 938,643" fill="#281E1E" />
      <polygon points="1190,598 1133,613 1117,630 1107,660 1164,643" fill="#281E1E" />
      <polygon points="735,662 862,634 980,700 1000,745 1023,772 1051,797 1023,812" fill="#F9F6E3" />
      <polygon points="1366,662 1240,634 1122,700 1102,745 1080,772 1051,797 1080,812" fill="#F9F6E3" />
      <path d="M1030 762L1051 758L1072 762L1080 772Q1066 790 1051 797Q1036 790 1023 772Z" fill="#281E1E" />
      <polygon points="1023,810 1051,797 1080,810 1072,815 1030,815" fill="#281E1E" />
    </svg>
  );
}
