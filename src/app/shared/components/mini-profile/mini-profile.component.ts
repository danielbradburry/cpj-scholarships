import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'mini-profile',
  templateUrl: './mini-profile.component.html',
  styleUrls: ['./mini-profile.component.scss']
})
export class MiniProfileComponent implements OnInit {
  @Input() user: any;
  @Input() config: any;

  constructor() {}

  ngOnInit() {}
}
