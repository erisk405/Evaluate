"use client"
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Custom title mappings (optional)
const CUSTOM_TITLES: { [key: string]: string } = {
  'dashboard': 'Dashboard',
  // Add more custom mappings as needed
};

// Utility function to convert path segments to readable titles
const convertToTitle = (segment: string) => {
  // Check if there's a custom title first
  if (CUSTOM_TITLES[segment]) return CUSTOM_TITLES[segment];

  // Default conversion
  return segment
    .replace(/[-_]/g, " ")  // Replace hyphens and underscores with spaces
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))  // Capitalize each word
    .join(' ');
};

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  
  // Split the pathname and remove empty segments
  const pathSegments = pathname.split('/').filter(segment => segment !== '');
  
  // If no segments (root path), return null or just Home
  if (pathSegments.length === 0) {
    return (
      <BreadcrumbItem>
        <BreadcrumbLink href="/overview">Home</BreadcrumbLink>
      </BreadcrumbItem>
    );
  }
  
  // Create breadcrumb items
  const breadcrumbItems = pathSegments.map((segment, index) => {
    // Construct the href for each breadcrumb item
    const href = `#`;
    const title = convertToTitle(segment);
    
    // If it's the last segment, render as a page, otherwise as a link
    if (index === pathSegments.length - 1) {
      return (
        <BreadcrumbItem key={segment}>
          <BreadcrumbPage>{title}</BreadcrumbPage>
        </BreadcrumbItem>
      );
    }
    
    return (
      <React.Fragment key={segment}>
        <BreadcrumbItem>
          <BreadcrumbLink href={href}>{title}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
      </React.Fragment>
    );
  });

  // Always add Home as the first breadcrumb item
  return (
    <>
      <BreadcrumbItem key="home">
        <BreadcrumbLink href="/overview">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator key="home-separator" />
      {breadcrumbItems}
    </>
  );
}