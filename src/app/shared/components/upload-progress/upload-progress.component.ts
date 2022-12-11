import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'upload-progress',
  templateUrl: './upload-progress.component.html',
  styleUrls: ['./upload-progress.component.scss']
})
export class UploadProgressComponent implements OnInit {
  @Input() fileUploads: any;

  constructor() {}

  ngOnInit() {}

  convertToNumber(value) {
    return parseInt(value);
  }
}
