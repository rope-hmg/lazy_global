import { runTests, assertEq } from "absolute_unit_test";
import { lazy, lazyWithRetry } from "./index";

runTests(
    class {
        "lazy should only evaluate once"() {
            let evalCount = 0;
            const lazyString = lazy(() => ((evalCount += 1), "some complicated and expensive thing"));

            lazyString.value;
            lazyString.value;
            lazyString.value;

            assertEq(evalCount, 1);
        }

        "lazy should always evaluate to the same value"() {
            const lazyString = lazy(() => "some complicated and expensive thing");

            assertEq(lazyString.value, "some complicated and expensive thing");
            assertEq(lazyString.value, "some complicated and expensive thing");
            assertEq(lazyString.value, "some complicated and expensive thing");
        }

        "lazyWithRetry should only reevaluate if it failed"() {
            let evalCount = 0;
            const lazyString = lazyWithRetry((onSuccess) => {
                if (evalCount < 2) {
                    evalCount += 1;
                    return "failure";
                }
                onSuccess();
                return "success";
            });

            lazyString.value;
            lazyString.value;
            lazyString.value;

            assertEq(evalCount, 2);
        }

        "lazyWithRetry should evaluate to the correct return value"() {
            let evalCount = 0;
            const lazyString = lazyWithRetry((onSuccess) => {
                if (evalCount < 2) {
                    evalCount += 1;
                    return "failure";
                }
                onSuccess();
                return "success";
            });

            assertEq(lazyString.value, "failure");
            assertEq(lazyString.value, "failure");
            assertEq(lazyString.value, "success");
        }
    },
);
