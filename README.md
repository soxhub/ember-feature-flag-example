# ember-feature-flag-example

Build time code obfuscation for the frontend.

Often you may create long running branches to work on features that you don't want deployed to customers...just yet.  This system allows you to instead continue working on features and fleshing out bugs while still continuously shipping!

Benefits include lower JS / CSS bundles, protecting sensitive information and more!

Supported file types:
- JS
- HBS
- CSS

Example npm scripts
- `npm run build:on` 
- `npm run build:off`

// e.g. `"npm run start:on": "FEATURE_CUSTOMER_1=true ember build --environment=production"`

- Remove files based on feature flags
- Branch level code isolation in .js and hbs files
- Production environments strips at build time, development && test environment is runtime isolation to allow ease of testing

## Example uses

```
// file1.js
// @remove-if-enabled CUSTOMER_1

export const ...
```

```
// file1.js
if (feature('CUSTOMER_1')) {
  // include if enabled
}
```

```
// file1.hbs
{{#if feature-enabled('CUSTOMER_1')}}
  // include if enabled
{{else}}
  // include if disabled
{{/if}}
```

TODO:

- AST evaluation for JS and HBS files
- Consider `macroCondition` from `@embroider/macros` instead wrapped by a pull in and evaluate the feature flags
