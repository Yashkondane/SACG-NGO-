'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    MessageSquare,
    Mail,
    Home,
    Calendar,
    HeartHandshake,
    Search,
    Users,
    QrCode,
    LogOut,
    ChevronRight,
    Settings,
    FileText,
    MapPin
} from 'lucide-react'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <Sidebar variant="sidebar">
            <SidebarHeader className="py-4">
                <div className="flex items-center px-4 font-bold text-lg tracking-tight">
                    Admin Panel
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={pathname === '/admin'}>
                                    <Link href="/admin">
                                        <LayoutDashboard />
                                        <span>Overview</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={pathname === '/admin/messages'}>
                                    <Link href="/admin/messages">
                                        <MessageSquare />
                                        <span>Messages</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={pathname === '/admin/newsletters'}>
                                    <Link href="/admin/newsletters">
                                        <Mail />
                                        <span>Newsletters</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={pathname === '/admin/contact'}>
                                    <Link href="/admin/contact">
                                        <MapPin />
                                        <span>Contact Page</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Content & Sections</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={pathname === '/admin/home'}>
                                    <Link href="/admin/home">
                                        <Home />
                                        <span>Home Page</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <Collapsible defaultOpen={pathname.startsWith('/admin/events')} className="group/collapsible">
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton>
                                            <Calendar />
                                            <span>Events</span>
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton asChild isActive={pathname === '/admin/events'}>
                                                    <Link href="/admin/events">
                                                        <span>Manage Events</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton asChild isActive={pathname === '/admin/events-pages'}>
                                                    <Link href="/admin/events-pages">
                                                        <span>Events Pages</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>

                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={pathname === '/admin/sponsors'}>
                                    <Link href="/admin/sponsors">
                                        <HeartHandshake />
                                        <span>Sponsors</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <Collapsible defaultOpen={pathname.startsWith('/admin/discover')} className="group/collapsible">
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton>
                                            <Search />
                                            <span>Discover</span>
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton asChild isActive={pathname === '/admin/discover/non-profits'}>
                                                    <Link href="/admin/discover/non-profits">
                                                        <span>Non-Profits</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton asChild isActive={pathname === '/admin/discover/organisations'}>
                                                    <Link href="/admin/discover/organisations">
                                                        <span>Organisations</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>

                            <Collapsible defaultOpen={pathname.startsWith('/admin/about')} className="group/collapsible">
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton>
                                            <Users />
                                            <span>About Us</span>
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton asChild isActive={pathname === '/admin/about/members'}>
                                                    <Link href="/admin/about/members">
                                                        <span>Board Members</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton asChild isActive={pathname === '/admin/about/story'}>
                                                    <Link href="/admin/about/story">
                                                        <span>Our Story</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>

                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={pathname === '/admin/qr'}>
                                    <Link href="/admin/qr">
                                        <QrCode />
                                        <span>Dynamic QRs</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={pathname === '/admin/settings'}>
                                    <Link href="/admin/settings">
                                        <Settings />
                                        <span>Global Settings</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/admin/login" onClick={() => {/* Logout logic here if needed, but they might use a button instead of a link */}}>
                                <LogOut />
                                <span>Logout</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
