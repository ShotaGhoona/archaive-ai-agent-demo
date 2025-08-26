# Document Home Refactoring Strategy

## Current Issues
1. TypeScript errors due to varying column types (`@typescript-eslint/no-explicit-any`)
2. All document types (quotation, order, delivery, invoice, specification, inspection) are handled in a single container
3. Type casting with `any` throughout the codebase
4. Monolithic structure makes maintenance difficult

## Target Architecture

### File Structure

```
src/
├── app/
│   └── document/
│       └── (home)/
│           ├── page.tsx                            # Main document home page (route to /document)
│           ├── quotation/
│           │   └── page.tsx                        # /document/quotation
│           ├── order/
│           │   └── page.tsx                        # /document/order
│           ├── delivery/
│           │   └── page.tsx                        # /document/delivery
│           ├── invoice/
│           │   └── page.tsx                        # /document/invoice
│           ├── specification/
│           │   └── page.tsx                        # /document/specification
│           └── inspection/
│               └── page.tsx                        # /document/inspection

├── widgets/
│   └── document/
│       ├── document-layout/
│       │   ├── ui/
│       │   │   ├── DocumentLayoutContainer.tsx      # Main layout wrapper
│       │   │   ├── DocumentTypeHeader.tsx          # Tab navigation (existing)
│       │   │   └── index.ts
│       │   ├── model/
│       │   │   ├── types.ts
│       │   │   └── index.ts
│       │   └── lib/
│       │       └── index.ts
│       
├── page-components/
│   ├── document/
│   │   └── home/
│   │       ├── quotation/
│   │       │   ├── ui/
│   │       │   │   ├── DocumentHomeQuotationContainer.tsx   # Quotation-specific container
│   │       │   │   ├── DocumentHomeQuotationPageHeader.tsx  # Quotation search/filter header
│   │       │   │   ├── DocumentHomeQuotationTableView.tsx   # Quotation table
│   │       │   │   └── index.ts
│   │       │   ├── lib/
│   │       │   │   ├── quotationCsvConfig.ts        # Quotation CSV config
│   │       │   │   ├── quotationFilterConfig.ts     # Quotation filter config
│   │       │   │   ├── quotationSearchbarConfig.ts  # Quotation searchbar config
│   │       │   │   ├── quotationTableConfig.tsx     # Quotation table config
│   │       │   │   └── index.ts
│   │       │   ├── model/
│   │       │   │   ├── types.ts                     # Quotation-specific types
│   │       │   │   └── index.ts
│   │       │   └── data/
│   │       │       └── quotationData.ts             # Quotation mock data
│   │       │
│   │       ├── order/
│   │       │   ├── ui/
│   │       │   │   ├── DocumentHomeOrderContainer.tsx
│   │       │   │   ├── DocumentHomeOrderPageHeader.tsx
│   │       │   │   ├── DocumentHomeOrderTableView.tsx
│   │       │   │   └── index.ts
│   │       │   ├── lib/
│   │       │   │   ├── orderCsvConfig.ts
│   │       │   │   ├── orderFilterConfig.ts
│   │       │   │   ├── orderSearchbarConfig.ts
│   │       │   │   ├── orderTableConfig.tsx
│   │       │   │   └── index.ts
│   │       │   ├── model/
│   │       │   │   ├── types.ts
│   │       │   │   └── index.ts
│   │       │   └── data/
│   │       │       └── orderData.ts
│   │       │
│   │       ├── delivery/
│   │       │   ├── ui/
│   │       │   │   ├── DocumentHomeDeliveryContainer.tsx
│   │       │   │   ├── DocumentHomeDeliveryPageHeader.tsx
│   │       │   │   ├── DocumentHomeDeliveryTableView.tsx
│   │       │   │   └── index.ts
│   │       │   ├── lib/
│   │       │   │   ├── deliveryCsvConfig.ts
│   │       │   │   ├── deliveryFilterConfig.ts
│   │       │   │   ├── deliverySearchbarConfig.ts
│   │       │   │   ├── deliveryTableConfig.tsx
│   │       │   │   └── index.ts
│   │       │   ├── model/
│   │       │   │   ├── types.ts
│   │       │   │   └── index.ts
│   │       │   └── data/
│   │       │       └── deliveryData.ts
│   │       │
│   │       ├── invoice/
│   │       │   ├── ui/
│   │       │   │   ├── DocumentHomeInvoiceContainer.tsx
│   │       │   │   ├── DocumentHomeInvoicePageHeader.tsx
│   │       │   │   ├── DocumentHomeInvoiceTableView.tsx
│   │       │   │   └── index.ts
│   │       │   ├── lib/
│   │       │   │   ├── invoiceCsvConfig.ts
│   │       │   │   ├── invoiceFilterConfig.ts
│   │       │   │   ├── invoiceSearchbarConfig.ts
│   │       │   │   ├── invoiceTableConfig.tsx
│   │       │   │   └── index.ts
│   │       │   ├── model/
│   │       │   │   ├── types.ts
│   │       │   │   └── index.ts
│   │       │   └── data/
│   │       │       └── invoiceData.ts
│   │       │
│   │       ├── specification/
│   │       │   ├── ui/
│   │       │   │   ├── DocumentHomeSpecificationContainer.tsx
│   │       │   │   ├── DocumentHomeSpecificationPageHeader.tsx
│   │       │   │   ├── DocumentHomeSpecificationTableView.tsx
│   │       │   │   └── index.ts
│   │       │   ├── lib/
│   │       │   │   ├── specificationCsvConfig.ts
│   │       │   │   ├── specificationFilterConfig.ts
│   │       │   │   ├── specificationSearchbarConfig.ts
│   │       │   │   ├── specificationTableConfig.tsx
│   │       │   │   └── index.ts
│   │       │   ├── model/
│   │       │   │   ├── types.ts
│   │       │   │   └── index.ts
│   │       │   └── data/
│   │       │       └── specificationData.ts
│   │       │
│   │       └── inspection/
│   │           ├── ui/
│   │           │   ├── DocumentHomeInspectionContainer.tsx
│   │           │   ├── DocumentHomeInspectionPageHeader.tsx
│   │           │   ├── DocumentHomeInspectionTableView.tsx
│   │           │   └── index.ts
│   │           ├── lib/
│   │           │   ├── inspectionCsvConfig.ts
│   │           │   ├── inspectionFilterConfig.ts
│   │           │   ├── inspectionSearchbarConfig.ts
│   │           │   ├── inspectionTableConfig.tsx
│   │           │   └── index.ts
│   │           ├── model/
│   │           │   ├── types.ts
│   │           │   └── index.ts
│   │           └── data/
│   │               └── inspectionData.ts
```

## Implementation Strategy

### Phase 1: Create DocumentLayoutContainer
1. Implement `DocumentLayoutContainer.tsx` based on `BlueprintDetailLayout` pattern
2. Include DocumentTypeHeader for tab navigation
3. Provide children slot for page-specific content
4. Handle global document layout state

### Phase 2: Extract Individual Document Types
1. **Extract Quotation Module**
   - Move quotation-specific logic from current `DocumentHomeContainer` 
   - Create `DocumentHomeQuotationContainer.tsx` with proper typing
   - Extract quotation configs to dedicated files
   - Use proper `Quotation` type instead of `any`

2. **Extract Order Module** 
   - Similar process for Order type
   - Create `DocumentHomeOrderContainer.tsx`
   - Extract order configs

3. **Extract Delivery Module**
   - Similar process for Delivery type
   - Create `DocumentHomeDeliveryContainer.tsx`

4. **Extract Invoice Module** 
   - Similar process for Invoice type
   - Create `DocumentHomeInvoiceContainer.tsx`

5. **Extract Specification Module**
   - Similar process for Specification type
   - Create `DocumentHomeSpecificationContainer.tsx`

6. **Extract Inspection Module**
   - Similar process for Inspection type
   - Create `DocumentHomeInspectionContainer.tsx`

### Phase 3: Update Main Container
1. Update main document home to use new layout
2. Route to appropriate child component based on selected type
3. Remove old monolithic structure

## Key Benefits

### 1. Type Safety
- Each module uses its specific type (Quotation, Order, etc.)
- Eliminates `any` type usage
- Resolves TypeScript errors

### 2. Modularity
- Each document type is independently maintainable
- Clear separation of concerns
- Easier testing and debugging

### 3. Scalability
- Easy to add new document types
- Configuration changes are isolated
- Better code organization

### 4. Perfect Encapsulation
- Each module exports everything needed through barrel exports (index.ts)
- Import statements are extremely simple and clean
- Dependencies are clearly defined at module boundaries

## Usage Pattern

```tsx
// app/document/(home)/page.tsx - Main document home page
export default function DocumentHomePage() {
  return <DocumentHomeQuotationContainer />;
}

// app/document/(home)/quotation/page.tsx
export default function QuotationPage() {
  return <DocumentHomeQuotationContainer />;
}

// app/document/(home)/order/page.tsx
export default function OrderPage() {
  return <DocumentHomeOrderContainer />;
}

// page-components/document/home/quotation/ui/DocumentHomeQuotationContainer.tsx
import { quotationData } from "../data";
import { DocumentHomeQuotationPageHeader, DocumentHomeQuotationTableView } from "../ui";
import { AdvancedFilterSidebar, useAdvancedFilter, useSearchbar } from "@/shared";
import { QUOTATION_FILTER_CONFIG, QUOTATION_SEARCHBAR_CONFIG, Quotation } from "../lib";
import { DocumentLayoutContainer } from "@/widgets";

export function DocumentHomeQuotationContainer() {
  const { filteredData, searchTerm, setSearchTerm, filters } = useQuotationData();
  
  return (
    <DocumentLayoutContainer activeType="quotation">
      <div className="h-full flex flex-col">
        <DocumentHomeQuotationPageHeader 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          documents={filteredData}
        />
        <DocumentHomeQuotationTableView 
          documents={filteredData}
        />
      </div>
    </DocumentLayoutContainer>
  );
}
```

## Important Design Principles

### Perfect Encapsulation
Each module must achieve complete encapsulation through:

1. **Barrel Exports**: Every module exports through `index.ts` files
2. **Clean Import Statements**: Import paths should be extremely simple
3. **Module Boundaries**: Clear separation of concerns at folder level

**Example of Clean Import Structure:**
```tsx
// ✅ Good: Clean, simple imports from module boundaries
import { quotationData } from "../data";
import { DocumentHomeQuotationPageHeader, DocumentHomeQuotationTableView } from "../ui";
import { AdvancedFilterSidebar, useAdvancedFilter, useSearchbar } from "@/shared";
import { QUOTATION_FILTER_CONFIG, QUOTATION_SEARCHBAR_CONFIG, Quotation } from "../lib";
import { DocumentLayoutContainer } from "@/widgets";

// ❌ Bad: Deep imports breaking encapsulation
import { DocumentHomeQuotationPageHeader } from "../ui/DocumentHomeQuotationPageHeader";
import { QUOTATION_FILTER_CONFIG } from "../lib/quotationFilterConfig";
import { quotationData } from "../data/quotationData";
```

### Module Export Strategy
- **ui/index.ts**: Export all UI components
- **lib/index.ts**: Export all configs, types, and utilities  
- **data/index.ts**: Export all data objects
- **model/index.ts**: Export all types and interfaces

This ensures that import statements remain clean and dependencies are clearly defined.

## Migration Plan

1. **Preparation**: Create new directory structure including app routes
2. **Widget Creation**: Implement DocumentLayoutContainer with proper tab navigation
3. **App Router Setup**: Create individual page.tsx files for each document type
4. **Module Extraction**: Extract each document type one by one with proper encapsulation
5. **Barrel Exports**: Create comprehensive index.ts files for clean imports
6. **Integration**: Update tab navigation to handle routing between pages
7. **Cleanup**: Remove old monolithic files
8. **Testing**: Verify all functionality works correctly

## Routing Strategy

### Navigation Flow
- **DocumentTypeHeader** tabs will use Next.js navigation to route between:
  - `/document/quotation`
  - `/document/order`
  - `/document/delivery`
  - `/document/invoice`
  - `/document/specification`
  - `/document/inspection`

### Layout Persistence
- `DocumentLayoutContainer` provides consistent layout across all document types
- Tab state and navigation handled by Next.js App Router
- Each route renders its specific container component within the shared layout

This approach eliminates type errors, improves maintainability, follows the established architecture patterns, and properly leverages Next.js App Router for clean URL-based navigation.