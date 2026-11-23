# Portfolio maintenance

The profile README and static website describe the same professional focus. Website files live in `docs/`; no dependency installation or build step is required.

## GitHub Pages

In this repository’s **Settings / Pages**, choose **Deploy from a branch**, select **main** and the **/docs** directory, then save. The intended address is `https://joaosalero.github.io/joaosalero/`. The profile repository remains `joaosalero/joaosalero`. Publishing status must be verified separately; having these source files does not mean the site is live.

The public site contains a printable professional overview rather than the original CV. Do not add private phone numbers, confidential client information or client evaluation materials. Confirm public contact information before adding it.

## Preview and review

Serve `docs/` with a local static HTTP server, then review `index.html` and `profile.html` in a browser. Check desktop and narrow mobile widths, keyboard navigation, focus visibility, expanded project details, reduced-motion preferences and the profile’s print view.

Run the portable structural check from the repository root:

```sh
node scripts/check-site.mjs
```

The check validates local HTML asset/link targets, fragment IDs, required accessibility structure and basic content safeguards. It does not replace browser accessibility review or verify external links, project implementation claims, deployment status or WCAG conformance.

## Editorial rules

- Verify each capability against the current repository before changing a project summary.
- Keep delivered behaviour, limitations and future work distinct.
- Preserve training versus certification distinctions and the status of ongoing education.
- Do not publish benchmark results without a reproducible method and measured evidence.
- Update the README and professional profile when verified professional information changes.
- No analytics, remote fonts, cookies, JavaScript, forms or third-party embeds are used. External links open in the same tab.
- Relative asset links support GitHub Pages’ repository subpath. Preserve them when adding pages.
- After deployment is verified, replace the README’s source-file profile link with the deployed profile URL and add the live portfolio link.
