import { defineQuery } from "next-sanity";

// Singletons are anchored on both the published id and the draft id
// ("drafts.homePage") rather than just _id == "homePage", so a stray second
// document of the same type can never win the [0] pick, while the query keeps
// resolving under the "drafts" perspective if Visual Editing is added later.

export const HOME_PAGE_QUERY = defineQuery(`*[_type == "homePage" && _id in ["homePage", "drafts.homePage"]][0]{
  hero{ headingLines, subheading, ctaLabel },
  portfolio{ heading },
  curated{ heading },
  approach{ label, body },
  unlock{ headingLines, items },
  explore{ headingLines, body, ctaLabel }
}`);

export const SITE_SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings" && _id in ["siteSettings", "drafts.siteSettings"]][0]{
  navCtaLabel,
  seo{ title, description, ogTitle, ogDescription, ogImage },
  footer{
    learnHeading,
    learnLinks[]{ _key, label, href },
    connectHeading,
    socials{ linkedin, x, instagram },
    copyright
  }
}`);

export const REQUEST_ACCESS_FORM_QUERY = defineQuery(`*[_type == "requestAccessForm" && _id in ["requestAccessForm", "drafts.requestAccessForm"]][0]{
  title,
  intro,
  name{ label, placeholder },
  company{ label, placeholder },
  email{ label, placeholder },
  note{ label, placeholder },
  optInText,
  submitLabel,
  sendingLabel,
  errorMessage,
  successTitle,
  successBody
}`);

export const PARTNERS_QUERY = defineQuery(`*[_type == "partner"] | order(orderRank){
  _id,
  name,
  logo
}`);

export const TEAM_QUERY = defineQuery(`*[_type == "teamMember"] | order(orderRank){
  _id,
  name,
  role,
  bio,
  photo
}`);
