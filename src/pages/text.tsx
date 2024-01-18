/**
 * v0 by Vercel.
 * @see https://v0.dev/t/jGqTEgMIY7M
 */
import Link from "next/link"
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu"
import { PopoverTrigger, PopoverContent, Popover } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CardDescription, CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"
// import { ResponsiveBar } from "@nivo/bar" // 👽👽 issue with nivo [v0.81.0 can lead to import issues #2310]
const ResponsiveBar = dynamic(() => import('@nivo/bar').then(m => m.ResponsiveBar), { ssr: false });
const ResponsiveScatterPlot = dynamic(() => import('@nivo/scatterplot').then(m => m.ResponsiveScatterPlot), { ssr: false });
const ResponsiveLine = dynamic(() => import('@nivo/line').then(m => m.ResponsiveLine), { ssr: false });
const ResponsivePie = dynamic(() => import('@nivo/pie').then(m => m.ResponsivePie), { ssr: false });
// import { ResponsiveScatterPlot } from "@nivo/scatterplot"
// import { ResponsiveLine } from "@nivo/line"
// import { ResponsivePie } from "@nivo/pie"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { JSX, SVGProps } from "react"
import { ClassAttributes, HTMLAttributes } from "react"

export default function Component() {
  return (
    <div className="flex flex-col h-screen">
      
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        
        <div className="grid md:grid-cols-1 gap-6">
              <Card className="flex flex-col">
                <CardHeader>
                  <CardDescription>DNS Records</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Record Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>TTL</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>www.example.com</TableCell>
                        <TableCell>A</TableCell>
                        <TableCell>3600</TableCell>
                        <TableCell>Active</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>mail.example.com</TableCell>
                        <TableCell>MX</TableCell>
                        <TableCell>3600</TableCell>
                        <TableCell>Active</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>ftp.example.com</TableCell>
                        <TableCell>CNAME</TableCell>
                        <TableCell>3600</TableCell>
                        <TableCell>Inactive</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
      </main>
    </div>
  )
}

