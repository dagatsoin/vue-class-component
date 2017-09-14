import Vue, { ComponentOptions } from "vue";
import { VueClass } from "./declarations";
import { componentFactory, $internalHooks } from "./component";

export { createDecorator } from "./util";

function Component <U extends Vue>(options: ComponentOptions<U>): <V extends VueClass>(target: V) => V;
function Component <V extends VueClass>(target: V): V;
function Component <V extends VueClass, U extends Vue>(
    options: ComponentOptions<U> | V
): any {
  if (typeof options === "function") {
    return componentFactory(options);
  }
  return function (Comp: V) {

    // Collect static properties
    const staticProps: Array<{key: string, value: any}> = Object.keys(Comp)
        .filter(key => key.charAt(0) !== "_")
        .map(key => ({key, value: Comp[key]}));

    const Component = componentFactory(Comp, options);

    // Re add static properties
    staticProps.forEach(prop => Component[prop.key] = prop.value);

    return Component;
  };
}

namespace Component {
  export function registerHooks (keys: string[]): void {
    $internalHooks.push(...keys);
  }
}

export default Component;
