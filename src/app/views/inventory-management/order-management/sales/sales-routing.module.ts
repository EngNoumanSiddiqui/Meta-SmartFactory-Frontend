import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NewSaleComponent } from "./new/new.component";
import { EditSaleComponent } from "./edit/edit.component";
import { DetailSaleComponent } from "./detail/detail.component";
import { ListSalesComponent } from "./list/list.component";
import { ListSalesItemsComponent } from "./order-detail-items/list.component";
import { ListSalesReportComponent } from "./report/report.component";

const routes: Routes = [
  {
    path: "",
    data: { title: "sales" },
    children: [
      { path: "", redirectTo: "base", pathMatch: "full" },
      {
        path: "new",
        component: NewSaleComponent,
        data: { title: "new-sales-order" },
      },
      {
        path: "edit/:id",
        component: EditSaleComponent,
        data: { title: "edit-sales-order" },
      },
      {
        path: "detail/:id",
        component: DetailSaleComponent,
        data: { title: "sales-order-detail" },
      },
      {
        path: "base/items/reports",
        component: ListSalesReportComponent,
        data: { title: "reports" },
      },
      {
        path: "base/items",
        component: ListSalesItemsComponent,
        data: { title: "sales-orders-items" },
      },
      {
        path: "base",
        component: ListSalesComponent,
        data: { title: "sales-orders" },
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule {}
