# Absolute Unit Test

A minimal unit testing library

## Example

```javascript
import { lazy } from "lazy_global";

const LAZY_OBJECT = lazy(() => "Some expensive to compute value");

function doSomething() {
    const lazyValue = LAZY_OBJECT.value;
}
```

```javascript
import { lazyWithRetry } from "lazy_global";

const LAZY_OBJECT = lazyWithRetry((onSuccess) => {
    if (somethingThatCanFail()) {
        onSuccess();
        return "Some expensive to compute value";
    }

    return "Failure value";
});

function doSomething() {
    const lazyValue = LAZY_OBJECT.value;

    if (lazyValue === "Failure value") {
        // Handle the case where the value is not available.
    }
}
```
