import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { getSubscriptionCount } from '@/lib/subscription'
import { RiPagesLine } from 'react-icons/ri'
import { FiMail } from 'react-icons/fi'

export default async function AdminDashboard() {
  const postsCount = allCoreContent(sortPosts(allBlogs)).length
  const subscriptionCount = await getSubscriptionCount()

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Total Posts"
          value={allCoreContent(sortPosts(allBlogs)).length.toString()}
          description="3 new in the last week"
          icon={<RiPagesLine />}
        />
        <DashboardCard
          title="Subscriptions"
          value={subscriptionCount.toString()}
          description="Newsletter sign-ups"
          icon={<FiMail />}
        />
      </div>

      <div className="mt-8 rounded-lg bg-slate-100 p-6 shadow-md dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
        <p className="text-gray-600 dark:text-gray-400">
          This is a placeholder for recent activity. You can add your admin functionality here.
        </p>
      </div>
    </>
  )
}

// Dashboard card component
function DashboardCard({
  title,
  value,
  description,
  icon,
}: {
  title: string
  value: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-lg bg-slate-100 p-6 shadow-md dark:bg-gray-800">
      <div className="flex items-center">
        <div className="bg-primary-100 dark:bg-primary-900 mr-4 rounded-full p-3">{icon}</div>
        <div>
          <h3 className="text-lg font-medium text-slate-800 dark:text-white">{title}</h3>
          <p className="text-3xl font-bold text-slate-800 dark:text-white">{value}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
    </div>
  )
}
