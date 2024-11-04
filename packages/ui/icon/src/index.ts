import { Check } from "./check.js";
import { Eye } from "./eye.js";
import { Loader2 } from "./loader2.js";
import { Pencil } from "./pencil.js";
import { Plus } from "./plus.js";
import { User } from "./user.js";
import { X } from "./x.js";

const Icon: {
  Check: typeof Check;
  X: typeof X;
  Eye: typeof Eye;
  Loader2: typeof Loader2;
  User: typeof User;
  Pencil: typeof Pencil;
  Plus: typeof Plus;
} = {
  Check,
  X,
  Eye,
  Loader2,
  Pencil,
  User,
  Plus,
};

export { Icon };
