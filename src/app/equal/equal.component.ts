import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-equal',
  templateUrl: './equal.component.html',
  styleUrls: ['./equal.component.scss']
})
export class EqualComponent implements OnInit {

  public bigText = 'lorem ipsum dolor sit amet, consectetur adipiscing elit. sed non risus. suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.';
  public smallText = 'lorem ipsum dolor sit amet, consectetur adipiscing elit. sed non risus.';
  public littleText = 'lorem ipsum dolor.';
  public dateIso8601Utc0 = '2024-01-17T12:38:46+0000';

  constructor() {
  }

  ngOnInit(): void {
  }

}
