import { clsx } from "clsx";
import { Icons } from "./icons.js";

export interface IconProps {
  /**
   * Size of icon. Default value is `m`
   */
  size?: "s" | "m" | "l";

  /**
   * Type of icon.
   */
  type: Icons;
}

const toUrl = function toUrl(icon: Icons): string {
  switch (icon) {
    case Icons.allowBackUp:
      return "before:[mask-image:url(/static/svg/tabler-icons/arrow-back-up.svg)]";
    case Icons.check:
      return "before:[mask-image:url(/static/svg/tabler-icons/check.svg)]";
    case Icons.chevronDown:
      return "before:[mask-image:url(/static/svg/tabler-icons/chevron-down.svg)]";
    case Icons.chevronLeft:
      return "before:[mask-image:url(/static/svg/tabler-icons/chevron-left.svg)]";
    case Icons.chevronRight:
      return "before:[mask-image:url(/static/svg/tabler-icons/chevron-right.svg)]";
    case Icons.circleArrowLeft:
      return "before:[mask-image:url(/static/svg/tabler-icons/circle-arrow-left.svg)]";
    case Icons.clipboardCheck:
      return "before:[mask-image:url(/static/svg/tabler-icons/clipboard-check.svg)]";
    case Icons.clipboard:
      return "before:[mask-image:url(/static/svg/tabler-icons/clipboard.svg)]";
    case Icons.clockHour1:
      return "before:[mask-image:url(/static/svg/tabler-icons/clock-hour-1.svg)]";
    case Icons.clockHour2:
      return "before:[mask-image:url(/static/svg/tabler-icons/clock-hour-2.svg)]";
    case Icons.clockHour3:
      return "before:[mask-image:url(/static/svg/tabler-icons/clock-hour-3.svg)]";
    case Icons.clockHour4:
      return "before:[mask-image:url(/static/svg/tabler-icons/clock-hour-4.svg)]";
    case Icons.clockHour5:
      return "before:[mask-image:url(/static/svg/tabler-icons/clock-hour-5.svg)]";
    case Icons.clockHour6:
      return "before:[mask-image:url(/static/svg/tabler-icons/clock-hour-6.svg)]";
    case Icons.clockHour7:
      return "before:[mask-image:url(/static/svg/tabler-icons/clock-hour-7.svg)]";
    case Icons.clockHour8:
      return "before:[mask-image:url(/static/svg/tabler-icons/clock-hour-8.svg)]";
    case Icons.clockHour9:
      return "before:[mask-image:url(/static/svg/tabler-icons/clock-hour-9.svg)]";
    case Icons.clockHour10:
      return "before:[mask-image:url(/static/svg/tabler-icons/clock-hour-10.svg)]";
    case Icons.clockHour11:
      return "before:[mask-image:url(/static/svg/tabler-icons/clock-hour-11.svg)]";
    case Icons.clockHour12:
      return "before:[mask-image:url(/static/svg/tabler-icons/clock-hour-12.svg)]";
    case Icons.doorExit:
      return "before:[mask-image:url(/static/svg/tabler-icons/door-exit.svg)]";
    case Icons.equal:
      return "before:[mask-image:url(/static/svg/tabler-icons/equal.svg)]";
    case Icons.eye:
      return "before:[mask-image:url(/static/svg/tabler-icons/eye.svg)]";
    case Icons.loader2:
      return "before:[mask-image:url(/static/svg/tabler-icons/loader-2.svg)]";
    case Icons.main:
      return "before:[mask-image:url(/static/svg/tabler-icons/mail.svg)]";
    case Icons.pencil:
      return "before:[mask-image:url(/static/svg/tabler-icons/pencil.svg)]";
    case Icons.settings:
      return "before:[mask-image:url(/static/svg/tabler-icons/settings.svg)]";
    case Icons.userX:
      return "before:[mask-image:url(/static/svg/tabler-icons/user-x.svg)]";
    case Icons.user:
      return "before:[mask-image:url(/static/svg/tabler-icons/user.svg)]";
    case Icons.users:
      return "before:[mask-image:url(/static/svg/tabler-icons/users.svg)]";
    case Icons.x:
      return "before:[mask-image:url(/static/svg/tabler-icons/x.svg)]";
  }
};

export const Icon = function Icon(props: IconProps) {
  const size = props.size ?? "m";

  const styles = clsx(
    "flex",
    "before:bg-gray",
    "before:inline-block",
    "before:flex-none",
    toUrl(props.type),
    "before:[mask-size:cover]",
    "before:[mask-position:center]",
    "before:[mask-repeat:no-repeat]",
    {
      "before:w-5 before:h-5": size == "s",
      "before:w-6 before:h-6": size == "m",
      "before:w-7 before:h-7": size == "l",
      "w-5 h-5": size == "s",
      "w-6 h-6": size == "m",
      "w-7 h-7": size == "l",
    }
  );

  return <span className={clsx(styles)}></span>;
};
