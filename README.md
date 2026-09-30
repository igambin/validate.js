validate.js
===
Validate.js provides a declarative way of validating javascript objects.

For documentation please see [validatejs.org/](http://validatejs.org/).

For issues and feature requests visit the [issue tracker](https://github.com/ansman/validate.js/issues).

Archive Notice
---
As I do not work as a web developer professionally any longer I do not have the bandwidth to maintain this. This project will continue to live as is but no new features will be added and no bugs will be fixed. There are likely better and more modern alternatives around.  

Building validate.js
---
### Requirements
  * [Node.js](https://nodejs.org/) 24.15+ (24.x) or 26+
  * pnpm 12.8.1 (the version pinned in `package.json`)

These requirements apply to development tooling, not the library's runtime.
The library still has no runtime dependencies. A global Grunt installation is
not required.

### Build steps
  1. `git clone git@github.com:ansman/validate.js.git`
  2. `cd validate.js`
  3. `pnpm install --frozen-lockfile --ignore-scripts`
  4. `pnpm build`

This will build *validate.min.js*, *validate.min.map* and the *docs* folder.

### Continuous testing
You can run continuous testing that runs the tests on file changes by running
`pnpm watch`.

Run lint, tests, and coverage once with `pnpm test`. Run only the specifications
with `pnpm run test:specs`. Tests use Jasmine with JSDOM and native promises;
no PhantomJS, browser download, or dependency build approval is needed.
Coverage reports are written to `coverage/`, including `coverage/lcov.info`.

Dependency security
---
Use pnpm and commit both `pnpm-lock.yaml` and `pnpm-workspace.yaml`. Dependency
lifecycle scripts are disabled in the workspace configuration. Do not approve
dependency builds. Installing with a different package manager will not apply
the workspace's security overrides.

JSHint pins older `minimatch` and `lodash` releases. The parent-scoped overrides
select patched versions within the same major versions; remove them only after
JSHint updates its dependencies and the audit and tests pass without them.

Run `pnpm audit` after dependency updates. CI runs the audit and complete build
on Windows and Linux with Node 24 and 26, including a weekly scheduled check.
The static pages use pinned CDN libraries; keep those URLs aligned with their
development dependencies when updating them. Bootstrap is CSS-only.

A clean dependency audit is not a complete source security review. Applications
must still validate on the server, escape validation messages when rendering
HTML, and use trusted constraints and regular expressions. Bound untrusted input
sizes to limit validation work. JSDOM tests do not replace real-browser testing.

Contributing
---
Before opening a pull request please make sure your changes follow the
[contribution guidelines](https://github.com/ansman/validate.js/blob/master/CONTRIBUTING.md).

Users of validate.js
---
If your site, library or application uses validate.js and would like to be shown
here please feel free to email <a href="mailto:info@validatejs.org">info@validatejs.org</a>
with the name and optionally a URL to the project and it will be added here.
