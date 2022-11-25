// Currenty we systematically bundle all the rules even if we only need a
// sub-section of them. We might support "code-splitting" the rules in the
// future.
import { Rule } from "publicodes";

export type { Names as OrientationCovidNames } from "./dist/orientation-covid/index.d.ts";

//export type DottedName = Names;

declare let rules: Record<key, Rule>;

declare let models: Record<key, rules>;

export default models;
