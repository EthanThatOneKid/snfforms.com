import { companyInfo } from './company';
import { getAssetUrl } from './utils';
import type { NormalizedCatalogItem } from './sheets';

/**
 * Generates a LocalBusiness JSON-LD object for SNF Printing.
 */
export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: companyInfo.name,
    description: companyInfo.description,
    url: companyInfo.website,
    telephone: companyInfo.contact.phone,
    email: companyInfo.contact.email,
    faxNumber: companyInfo.contact.fax,
    foundingDate: '1994',
    address: {
      '@type': 'PostalAddress',
      streetAddress: companyInfo.location.address,
      addressLocality: companyInfo.location.city,
      addressRegion: companyInfo.location.state,
      postalCode: companyInfo.location.zip,
      addressCountry: 'US',
    },
    image: `${companyInfo.website}/hero.jpg`,
    logo: `${companyInfo.website}/brand-logo.png`,
    slogan: companyInfo.mission,
    knowsAbout: [
      'Medical Forms',
      'Healthcare Printing',
      'Skilled Nursing Facility Forms',
      'CMS Forms',
      'Medical Supplies',
    ],
  };
}

/**
 * Generates a WebSite JSON-LD object with SearchAction for sitelinks.
 */
export function webSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: companyInfo.name,
    url: companyInfo.website,
    description: companyInfo.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${companyInfo.website}/forms?query={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generates a BreadcrumbList JSON-LD object from a list of breadcrumb items.
 */
export function breadcrumbListJsonLd(items: { label: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${companyInfo.website}${item.href}`,
    })),
  };
}

/**
 * Generates a Product JSON-LD object from a NormalizedCatalogItem.
 */
export function productJsonLd(form: NormalizedCatalogItem) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${companyInfo.website}/forms/${form.formId}`,
    name: form.description,
    image: [
      getAssetUrl(form.file0),
      ...(form.file1 ? [getAssetUrl(form.file1)] : []),
    ].filter(Boolean),
    description: form.description,
    sku: form.formId,
    brand: companyInfo.website,
    category: form.category,
    additionalProperty: [
      form.size && {
        '@type': 'PropertyValue',
        name: 'Size',
        value: form.size,
      },
      form.paper && {
        '@type': 'PropertyValue',
        name: 'Paper',
        value: form.paper,
      },
      form.color && {
        '@type': 'PropertyValue',
        name: 'Color',
        value: form.color,
      },
      form.sides && {
        '@type': 'PropertyValue',
        name: 'Sides',
        value: form.sides,
      },
      form.unit && {
        '@type': 'PropertyValue',
        name: 'Unit',
        value: form.unit,
      },
    ].filter(Boolean),
    ...(form.pdf0 && {
      subjectOf: {
        '@type': 'DigitalDocument',
        name: `${form.formId} PDF`,
        url: getAssetUrl(form.pdf0),
        encodingFormat: 'application/pdf',
      },
    }),
  };
}
