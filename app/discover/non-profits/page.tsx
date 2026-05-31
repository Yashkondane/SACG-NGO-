import DiscoverPage from '@/components/discover-page'

export const revalidate = 60 // Revalidate every 60 seconds

export default function NonProfitPage() {
  return (
    <DiscoverPage
      type="non-profit"
      pageSlug="discover-non-profit"
      defaultBadge="Community Non-Profits"
      defaultTitle="Our Partner Non-Profits"
      defaultDescription="We collaborate with amazing non-profit organizations to support and uplift our community."
      thankYouTitle="Thank You to Our Non-Profit Partners"
      thankYouDescription="Our non-profit partners help us drive meaningful impact. Through their dedication and services, we build a stronger, more resilient community."
    />
  )
}
