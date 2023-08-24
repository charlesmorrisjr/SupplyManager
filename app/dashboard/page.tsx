import { Metadata } from "next"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { CalendarDateRangePicker } from "./components/date-range-picker"
import { MainNav } from "./components/main-nav"
import { Overview } from "./components/overview"
import { TopPerformers } from "./components/top-performers"
import { WeeklyTrips } from "./components/weekly-trips-line"
import { WeeklyCases } from "./components/weekly-cases"
import { TripCompletion } from "./components/trip-completion"
import { Search } from "./components/search"
import TeamSwitcher from "./components/team-switcher"
import { UserNav } from "./components/user-nav"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
}

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {

  return (
    <>
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <div className="md:hidden">
        <Image
          src="/examples/dashboard-light.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="block dark:hidden"
        />
        <Image
          src="/examples/dashboard-dark.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="hidden dark:block"
        />
      </div>
      <Card className="shadow-2xl dark:shadow-lg dark:shadow-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          {/* <CardTitle className="text-xl font-medium">Dashboard</CardTitle> */}
        </CardHeader>
        <CardContent>
      <div className="hidden flex-col md:flex">
        {/* <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <TeamSwitcher />
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <UserNav />
            </div>
          </div>
        </div> */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center p-6 pt-0 justify-between space-y-2">
            <CardTitle className="mt-2 text-3xl font-bold tracking-tight">Dashboard</CardTitle>
            <div className="flex items-center space-x-2">
              {/* <CalendarDateRangePicker /> */}
              {/* <Button>Download</Button> */}
            </div>
          </div>
          <div className="space-y-4">
          {/* <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics" disabled>
                Analytics
              </TabsTrigger>
              <TabsTrigger value="reports" disabled>
                Reports
              </TabsTrigger>
              <TabsTrigger value="notifications" disabled>
                Notifications
              </TabsTrigger>
            </TabsList> */}
            {/* <TabsContent value="overview" className="space-y-4"> */}
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8 grid-rows-2">
                <TripCompletion />



                {/* <Card className='col-span-2 row-span-1'>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Items Today
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">98,999</div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% more than yesterday
                    </p>
                  </CardContent>
                </Card> */}

                {/* <Card className='col-span-2 row-start-2 row-span-1'>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Trips Completed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">55%</div>
                    <p className="text-xs text-muted-foreground">
                      5% higher than expected
                    </p>
                  </CardContent>
                </Card> */}

                <WeeklyTrips />

                {/* <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+12,234</div>
                    <p className="text-xs text-muted-foreground">
                      +19% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Now
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+573</div>
                    <p className="text-xs text-muted-foreground">
                      +201 since last hour
                    </p>
                  </CardContent>
                </Card> */}
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
                <WeeklyCases />

                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Top Performers</CardTitle>
                    <CardDescription>
                      The highest performing employees today
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TopPerformers />
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            {/* </TabsContent> */}
          {/* </Tabs> */}
          </div>
        </div>
      </div>

      </CardContent>
      </Card>

      </main>
    </>
  );
}
