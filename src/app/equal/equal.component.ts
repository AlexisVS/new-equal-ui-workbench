import {Component} from '@angular/core';

@Component({
  selector: 'app-equal',
  templateUrl: './equal.component.html',
  styleUrls: ['./equal.component.scss']
})
export class EqualComponent {

  public bigText: string | null = 'lorem ipsum dolor sit amet, consectetur adipiscing elit. sed non risus. suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.';
  public smallText: string | null = 'lorem ipsum dolor sit amet, consectetur adipiscing elit. sed non risus.';
  public littleText: string | null = 'lorem ipsum dolor.';
  public dateIso8601Utc0: string = '2024-01-17T12:38:46+0000';
  public disabled: boolean = false;
  public mode: 'view' | 'edit' = 'view';
  public eqTextAutoGrow: boolean = false;
  public eqTextMinHeight: number = 97;
  public eqTextMaxHeight: number | undefined = undefined;

  public toggleMode(): void {
    this.mode = this.mode === 'view' ? 'edit' : 'view';
  }

  public void(): void {
  }

}
