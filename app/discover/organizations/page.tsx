import DiscoverPage from '@/components/discover-page'

export const revalidate = 60 // Revalidate every 60 seconds

export default function OrganisationPage() {
  return (
    <DiscoverPage
      type="organisation"
      pageSlug="discover-organisation"
      defaultBadge="Community Organizations"
      defaultTitle="Our Partner Organizations"
      defaultDescription="We partner with leading organizations that share our commitment to enriching and empowering our community."
      thankYouTitle="Thank You to Our Organizational Partners"
      thankYouDescription="Our organizational partners play a crucial role in our mission. Their support and collaboration enable us to provide outstanding resources and events."
    />
  )
}
