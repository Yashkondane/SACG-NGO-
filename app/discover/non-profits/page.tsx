import DiscoverPage from '@/components/discover-page'

export const revalidate = 60 // Revalidate every 60 seconds

export default function NonProfitPage() {
  return (
    <DiscoverPage
      type="non-profit"
      pageSlug="discover-non-profit"
      defaultBadge="Community Non-Profits"
      defaultTitle="Community Non-Profits"
      defaultDescription="Discover amazing non-profit organizations that support and uplift our community."
      thankYouTitle="Our Featured Non-Profits"
      thankYouDescription="These non-profits help drive meaningful impact. Through their dedication and services, we build a stronger, more resilient community."
    />
  )
}
