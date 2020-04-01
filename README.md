# Lazy Global

Some utilities for creating lazily evaluated objects

## Example

```javascript
import { lazy } from "lazy_global";

const LAZY_OBJECT = lazy(() => "Some expensive to compute value");

function doSomething() {
    const lazyValue = LAZY_OBJECT.value;
}
```

```javascript
import { lazyPromise } from "lazy_global";

const LAZY_OBJECT = lazyPromise(async () => {
    if (somethingThatCanFail()) {
        return "Some expensive to compute value";
    }

    return Promise.reject("Failure value");
});

function doSomething() {
    try {
        const lazyValue = LAZY_OBJECT.value;
    } catch (error) {
        console.assert(error === "Failure value");
        // Handle the case where the value is not available.
    }
}
```
