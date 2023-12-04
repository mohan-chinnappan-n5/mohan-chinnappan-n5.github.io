## LWR (Lightning Web Runtime)

- The underlying technology that fuels the next generation of Experience Cloud sites
- Focus on performance and flexibility, LWR sites are faster 
- More developer-friendly than their Aura counterparts.

### Primary components
- LWR sites are a bundle of three primary pieces:
    - application that runs the site page
    - a set of plugins
    - components that define the user interface
- LWR delivers faster websites by working with both static and dynamic content. 

![lwr pieces](https://res.cloudinary.com/hy4kyit2a/f_auto,fl_lossy,q_70/learn/modules/lightning-web-runtime-for-experience-cloud/get-started-with-lightning-web-runtime/images/4e493c384358d81f291ee054ba187e0b_63-e-3170-e-b-56-e-4-f-99-8954-63-d-6-ebdd-53-cd.png)

- When you publish an LWR site
    -  framework and user interface layer are static
        - providing faster load times for customers who access the page.
    - All static content is compiled during the initial site build and then stored in the Salesforce content delivery network (CDN), which means the data is closer to the user and the site is delivered faster. 

   - Dynamic 
    -  data layer, made up of information from the Salesforce Platform, remains dynamic
    -  Salesforce records, business processes, and other live data are updated in real time. 
- The result is a website that is up to date with the most relevant information, but isn’t bogged down with slow load times. 


|Aura Framework Sites|LWR Sites
|---|--|
|Aura templates serve Lightning components dynamically.This means your site has to grab new data about components every time the page loads, slowing down the process.|With LWR, speed is the name of the game. The technology builds and caches all components and style elements when you publish your site and then serves them statically to your customers from the CDN|
||Static content allows us to provide you with sub-second content delivery and page loads.|
| This dynamic aspect allows changes to your Lightning components to display without the need to republish your site.|You must publish your site before any **component changes** are displayed to your customers, including updates made to standard Lightning components by Salesforce|
|authenticated sites add a pesky /s to all custom domain names: https://mycustomdomain.com/s/mypage|unauthenticated LWR sites is that they no longer include a /s in the site URL: Unauthenticated LWR sites allow you to create domain names without the /s. For example: https://mycustomdomain.com/mypage.|
|you can't make changes in the code using the Head Markup window.| comes with a slew of built-in style upgrades. You can access the default head markup and change various tags to make it your own.Editable tags include: **meta charset, title, and links to default style sheets**. But we didn’t stop there. LWR also has new ways to use themes layouts, page layouts, style hooks, and much more. |
|| comes an improved set of out-of-the-box **accessibility standards**, including F6 navigation and improved screen reader capabilities. Using F6 navigation, users can navigate between regions when they press F6, as opposed to the multiple keystrokes needed with tabbing. Define regions for your users, including the header and footer if you like. New screen reader capabilities are designed around the fact that LWR runs a single page application written in HTML. Screen readers adjust to theme changes dynamically and know when to start at the top of the page when things change.  |
||Ideal for high-volume sites that need to scale effectively|
|If your use case requires a comprehensive set of prebuilt components, you may want to consider sticking with Aura templates for the time being. |has fewer templates and out-of-the-box components|
||Developer training is often necessary to build custom components. If your use case is a bit more flexible, or you want to create custom components, LWR might be your new best friend|
||Either way, when developing your own custom components, we recommend using the Lightning Web Components (LWC) programming model, which is compatible with both Aura and LWR sites. And we’re creating new Lightning web components all the time, so soon enough you may be able to make the leap. |




### References
- [Get Started with Lightning Web Runtime](https://trailhead.salesforce.com/content/learn/modules/lightning-web-runtime-for-experience-cloud/get-started-with-lightning-web-runtime)
- [LWR Template Limitations](https://developer.salesforce.com/docs/atlas.en-us.exp_cloud_lwr.meta/exp_cloud_lwr/template_limitations.htm)
