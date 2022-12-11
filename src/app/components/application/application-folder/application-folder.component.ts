import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ConfirmService } from '../../../shared/components/confirm/confirm.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'application-folder',
  templateUrl: './application-folder.component.html',
  styleUrls: ['./application-folder.component.scss']
})
export class ApplicationFolderComponent implements OnInit {

  uploadProgress: any;
  accepts: string;
  fileTypeRestriction: string;
  @Input() fileUploads: any[];
  @Input() folder: any;
  @Input() applicationID: string;
  @Input() submitting: boolean;
  @Output() uploadedFile: EventEmitter<any> = new EventEmitter();
  @Output() removedFile: EventEmitter<any> = new EventEmitter();
  @Output() continue: EventEmitter<any> = new EventEmitter();
  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private confirmService: ConfirmService,
  ) { }

  ngOnInit() {
    switch(this.folder.fileTypeRestriction) {
      case 'image-pdf' : 
        this.accepts = 'Images (JPG/PNG) & PDFs only';
        this.fileTypeRestriction = 'image/jpeg,image/png,application/pdf';
        break;
      case 'images' : 
        this.accepts = 'Images only (JPG/PNG)';
        this.fileTypeRestriction = 'image/jpeg,image/png';
        break;
      case 'pdf' : 
        this.accepts = 'PDFs only';
        this.fileTypeRestriction = 'application/pdf';
        break;
      default : 
        this.accepts = 'Any file type';
        this.fileTypeRestriction = '';
    }
  }

  uploadFile(upload: any) {
    const limit = (this.folder.maxUploads - this.folder.applicationUploads.length) > upload.target.files.length ?
      upload.target.files.length :
      this.folder.maxUploads - this.folder.applicationUploads.length;
    
    for (let i = 0; i < limit; i++) {
      this.uploadedFile.emit(upload.target.files[i]);
    }
  }

  removeFile(file) {
    this.confirmService.confirm('Remove this file?', () => {
      this.removedFile.emit(file);
    });
  }

  continueFn() {
    this.continue.emit(true);
  }

  getExtension(name) {
    return name.split('.').pop();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
