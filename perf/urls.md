- [Lightning Page Performance](https://help.salesforce.com/s/articleView?id=sf.lightning_page_performance.htm&type=5)
- [Measure Lightning Experience Performance and Experienced Page Time (EPT)](https://trailhead.salesforce.com/content/learn/modules/lightning-experience-performance-optimization/measure-lightning-experience-performance-and-experience-page-time-ept)

- [Proactive Alert Monitoring: Experienced Page Time (EPT) Alert](https://help.salesforce.com/s/articleView?id=000392614&type=1)

 - [EP](https://trailhead.salesforce.com/trailblazer-community/topics/ept?sort=LAST_MODIFIED_DATE_DESC)
```
$A.metricsService.getCurrentPageTransaction().config.context.ept

$A.metricsService.getAllCacheStats()

$A.metricsService.getVersion()
```

## Consider the number, type, and placement of components on the page. 

### These design-related issues can cause a page to load slowly:

- Too many components visible on page load
- Too many heavy-impact related lists visible, especially those lists with multiple-object relationships
- Too many fields in your Record Detail component
- Having the News or Twitter component visible

If your page falls into one or more of these categories, we recommend that you move some components into a non-default tab or Accordion component section, unless you’re designing the page for blind or low-vision users. For the heavy-impact related lists, we recommend that you move the related lists lower on their respective page layouts so that they aren’t part of the initial page load.


f your Record Detail component has many fields, we recommend that you reduce the fields on your page layout to fewer than 60. Alternatively, move the Record Detail component into a non-default tab or Accordion section so that it’s not part of the initial page load.

For pages that are viewed on a phone, we recommend a maximum of eight visible components per page. If a page has more than eight, put some in a tab or Accordion section or hide them for mobile with a visibility filter.

You can see how your pages are performing in the Lightning Usage App from the App Launcher. It shows you the most used pages in your org and their page load time by browser or by page.

Performance Analysis for App Builder automatically runs when you build a page. If your page performance is poor or moderate, recommendations to improve performance appear. You can manually check a Lightning record page’s runtime performance at any time by clicking Analyze from the Lightning App Builder toolbar. It assesses page performance based on all visible standard and custom components on the page. Components in nondefault tabs and Accordion sections aren’t analyzed.

The User Metrics card provides 90 days of your org’s user data such as browser speeds, network latency, and number of cores. Use this information to help you decide which Performance Analysis for App Builder recommendations to take.

## Considerations
- If a page has more than 5 related lists or more than 25 fields in the record detail, users can encounter performance issues when viewing the page in the Salesforce mobile app.

In the Performance Analysis for App Builder tool:
- Components that are restricted to the desktop form factor via a visibility rule aren’t included in the phone form factor performance assessment.
- Analysis of page performance on a phone is available only on pages whose template supports the phone form factor.
- Components aren't the only factors influencing page load time, so the numbers in the component impact chart don't add up to 100% of the predicted page load time.
- Analysis of pages for the desktop form factor is measured in seconds. For the phone form factor, the page is scored based on the components that are visible when the page loads on a phone.
- User metrics are org-specific or page-specific data. Previously activated pages display metrics from visits to that page. New pages display metrics from visits to all org pages. Metrics displayed in a sandbox can differ from metrics in production.
