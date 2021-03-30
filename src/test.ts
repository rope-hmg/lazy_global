import { runTests, assert, assertEq } from "absolute_unit_test";
import { lazy, lazyPromise } from "./index";

runTests(
    class {
        "lazy should only evaluate once"() {
            let evalCount = 0;
            const lazyString = lazy(() => ((evalCount += 1), "some complicated and expensive thing"));

            lazyString.value();
            lazyString.value();
            lazyString.value();

            assertEq(evalCount, 1);
        }

        "lazy should always evaluate to the same value"() {
            const lazyString = lazy(() => "some complicated and expensive thing");

            assertEq(lazyString.value(), "some complicated and expensive thing");
            assertEq(lazyString.value(), "some complicated and expensive thing");
            assertEq(lazyString.value(), "some complicated and expensive thing");
        }

        async "lazyPromise should only reevaluate if it failed"() {
            let evalCount = 0;
            const lazyString = lazyPromise(async () => {
                if (evalCount < 2) {
                    evalCount += 1;
                    return Promise.reject("failure");
                }
                return "success";
            });

            try {
                await lazyString.value();
            } catch {}

            try {
                await lazyString.value();
            } catch {}

            try {
                await lazyString.value();
            } catch {}

            assertEq(evalCount, 2);
        }

        async "lazyPromise should evaluate to the correct return value"() {
            let evalCount = 0;
            const lazyString = lazyPromise(async () => {
                if (evalCount < 2) {
                    evalCount += 1;
                    return Promise.reject("failure");
                }
                return "success";
            });

            try {
                await lazyString.value();
                assert(false, "This code should never be executed");
            } catch (error) {
                assertEq(error, "failure");
            }

            try {
                await lazyString.value();
                assert(false, "This code should never be executed");
            } catch (error) {
                assertEq(error, "failure");
            }

            try {
                assertEq(await lazyString.value(), "success");
            } catch {
                assert(false, "This code should never be executed");
            }
        }
    },
);
