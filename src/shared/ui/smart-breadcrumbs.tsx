import React from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb';
import { formatBreadcrumbSegment } from 'shared/config';

interface SmartBreadcrumbsProps {
  className?: string;
  separator?: React.ReactNode;
}

const SmartBreadcrumbs: React.FC<SmartBreadcrumbsProps> = ({ 
  className,
  separator = '/'
}) => {
  const location = useLocation();
  
  // Split the pathname into segments and filter out empty strings
  const pathSegments = location.pathname
    .split('/')
    .filter(segment => segment !== '');
  
  // Generate breadcrumb items
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const isLast = index === pathSegments.length - 1;
    const pathToSegment = '/' + pathSegments.slice(0, index + 1).join('/');
    const displayName = formatBreadcrumbSegment(segment);
    
    if (isLast) {
      return (
        <BreadcrumbItem key={pathToSegment}>
          <BreadcrumbPage>{displayName}</BreadcrumbPage>
        </BreadcrumbItem>
      );
    }
    
    return (
      <BreadcrumbItem key={pathToSegment}>
        <BreadcrumbLink asChild>
          <Link to={pathToSegment}>{displayName}</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
    );
  });
  
  // Don't render breadcrumbs if we're on the root/home page
  if (pathSegments.length === 0 || (pathSegments.length === 1 && pathSegments[0] === 'home')) {
    return null;
  }
  
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {/* Always show Home as the first breadcrumb */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/home">Главная</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {/* Add separators and breadcrumb items */}
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={`separator-${index}`}>
            <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
            {item}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default SmartBreadcrumbs;
