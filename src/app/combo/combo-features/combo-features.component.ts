import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { IgxComboComponent, IgxToastComponent, IgxToastPosition } from "igniteui-angular";
import { RemoteService } from "../../grid/services/remote.service";
import { localData } from "./local-data";

@Component({
    providers: [RemoteService],
    selector: "app-combo",
    styleUrls: ["./combo-features.component.scss"],
    templateUrl: "./combo-features.component.html"
})
export class ComboFeatures {

    public prevRequest: any;
    @ViewChild("loadingToast", { read: IgxToastComponent }) public loadingToast: IgxToastComponent;
    @ViewChild("combo1", { read: IgxComboComponent }) public combo1: IgxComboComponent;
    public lData: any[];
    public rData: any;

    public VALUE_KEY = "field";
    public GROUP_KEY = "region";

    public filterable = true;
    public customValues = true;
    public disabled = false;

    @ViewChild("combo2", { read: IgxComboComponent }) public combo2: IgxComboComponent;

    constructor(private remoteService: RemoteService, public cdr: ChangeDetectorRef) {}

    public ngOnInit() {
        this.lData = localData;
        this.rData = this.remoteService.remoteData;
    }

    public ngAfterViewInit() {
        this.remoteService.getData(this.combo2.virtualizationState, null, (data) => {
            this.combo2.totalItemCount = data.Count;
        });
    }

    public handleAddition(event) { }

    public enableGroups(event) {
        this.combo1.groupKey = event.checked ? this.GROUP_KEY : "";
    }

    public dataLoading(evt) {
        if (this.prevRequest) {
            this.prevRequest.unsubscribe();
        }
        this.loadingToast.message = "Loading Remote Data...";
        this.loadingToast.position = IgxToastPosition.Middle;
        this.loadingToast.autoHide = false;
        this.loadingToast.show();
        this.cdr.detectChanges();
        this.prevRequest = this.remoteService.getData(this.combo2.virtualizationState, this.combo2.searchValue, () => {
            this.combo2.triggerCheck();
            this.loadingToast.hide();
            this.cdr.detectChanges();
        });
    }

    public searchInput(searchText) {
        this.remoteService.getData(this.combo2.virtualizationState, searchText,  (data) => {
            this.combo2.totalItemCount = searchText ? data.Results.length : data.Count;
        });
    }
}
