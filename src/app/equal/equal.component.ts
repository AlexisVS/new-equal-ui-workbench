import { ChangeDetectorRef, Component } from "@angular/core";

@Component({
    selector: "app-equal",
    templateUrl: "./equal.component.html",
    styleUrls: ["./equal.component.scss"],
})
export class EqualComponent {
    public bigText: string | null =
        "lorem ipsum dolor sit amet, consectetur adipiscing elit. sed non risus. suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.";
    public smallText: string | null =
        "lorem ipsum dolor sit amet, consectetur adipiscing elit. sed non risus.";
    public littleText: string | null = null;
    public dateIso8601Utc0: string | null = "2024-12-31T23:38:46+0000";
    public dateIso8601Utc0_2: string | null = "2025-02-28T12:38:46+0000";
    public dateRange: string | null =
        `${this.dateIso8601Utc0} - ${this.dateIso8601Utc0_2}`;

    public nullable: boolean = true;
    public disabled: boolean = false;
    public mode: "view" | "edit" = "edit";
    public eqTextAutoGrow: boolean = false;
    public eqTextMinHeight: number = 97;
    public eqTextMaxHeight: number | undefined = undefined;
    public dateTypeFormats: string[] = [
        "date.short.day",
        "date.short",
        "date.medium",
        "date.long",
        "date.full",
    ];
    public dateTypeFormatSelected: string = this.dateTypeFormats[1];
    public dateTimeTypeFormats: string[] = [
        "datetime.short",
        "datetime.medium",
        "datetime.long",
        "datetime.full",
    ];
    public dateTimeTypeFormatSelected: string = this.dateTimeTypeFormats[1];
    public reloadByBoolean: boolean = true;

    public ingredientListUrlFetch: string =
        "http://equal.local/?get=model_collect&entity=cooking\\Ingredient";
    public m2oFields = ["id", "name", "description"];
    public m2oControllerParams = {
        entity: "cooking\\Ingredient",
        fields: this.m2oFields,
        domain: [["id", ">", 0]],
    };

    constructor(private changeDetectorRef: ChangeDetectorRef) {}

    public refreshByBoolean(): void {
        this.reloadByBoolean = false;
        this.changeDetectorRef.detectChanges();
        this.reloadByBoolean = true;
    }

    public toggleMode(): void {
        this.mode = this.mode === "view" ? "edit" : "view";
    }

    public void(): void {}
}
