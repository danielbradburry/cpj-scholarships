import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable()
export class ScholarshipService {
  private applicant = new BehaviorSubject<any>(null);
  private application = new BehaviorSubject<any>(null);
  private program = new BehaviorSubject<any>(null);
  private scholarship = new BehaviorSubject<any>(null)
  currentApplicant = this.applicant.asObservable();
  currentApplication = this.application.asObservable();
  currentProgram = this.program.asObservable();
  currentScholarship = this.scholarship.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  setApplicant(data: any) {
    this.applicant.next(data);
  }

  setApplication(data: any) {
    this.application.next(data);
  }

  setProgram(data: any) {
    this.program.next(data);
  }

  setScholarship(data: any) {
    this.scholarship.next(data);
  }

  createApplicant(form) {
    return this.http.post(`${environment.apiDomain}scholarship-programs/applicants`, form);
  }

  updateApplicant(form) {
    return this.http.post(`${environment.apiDomain}scholarship-programs/applicants/update`, form);
  }

  getPasswordKey(scholarshipProgramURL, key) {
    return this.http.get(`${environment.apiDomain}scholarship-programs/${scholarshipProgramURL}/password/reset/${key}`);
  }

  changePassword(form) {
    return this.http.post(`${environment.apiDomain}scholarship-programs/applicants/password`, form); 
  }

  changePasswordByEmail(form) {
    return this.http.post(`${environment.apiDomain}scholarship-programs/password/reset/by-email`, form); 
  }

  login(form) {
    return this.http.post(`${environment.apiDomain}scholarship-programs/applicants/login`, form);
  }

  logout(form) {
    return this.http.post(`${environment.apiDomain}scholarship-programs/applicants/logout`, form);
  }

  resetPassword(scholarshipProgramURL, form) {
    return this.http.post(`${environment.apiDomain}scholarship-programs/${scholarshipProgramURL}/password/reset`, form);
  }

  getScholarshipProgramForView(scholarshipProgramURL) {
    return this.http.get(`${environment.apiDomain}scholarship-programs/${scholarshipProgramURL}/view`);
  }

  getScholarshipForView(scholarshipProgramURL, scholarshipURL) {
    return this.http.get(`${environment.apiDomain}scholarship-programs/${scholarshipProgramURL}/view/${scholarshipURL}`);
  }

  getScholarshipApplication(scholarshipProgramURL, scholarshipURL) {
    return this.http.get(`${environment.apiDomain}scholarship-programs/${scholarshipProgramURL}/${scholarshipURL}/application`);
  }

  createApplication(scholarshipProgramURL, scholarshipURL) {
    return this.http.post(`${environment.apiDomain}scholarship-programs/${scholarshipProgramURL}/${scholarshipURL}/applications`, {});
  }

  updateFormResponse(scholarshipProgramURL, scholarshipURL, applicationFormID, form) {
    return this.http.post(`${environment.apiDomain}scholarship-programs/${scholarshipProgramURL}/${scholarshipURL}/applications/application-forms/${applicationFormID}`, form);
  }

  uploadFile(scholarshipProgramURL, scholarshipURL, documentFolderID, file) {
    return this.http.post(`${environment.apiDomain}scholarship-programs/${scholarshipProgramURL}/${scholarshipURL}/applications/uploads/${documentFolderID}`, file, { reportProgress: true, observe: 'events'});
  }

  removeFile(scholarshipProgramURL, scholarshipURL, documentFolderID, file) {
    return this.http.post(`${environment.apiDomain}scholarship-programs/${scholarshipProgramURL}/${scholarshipURL}/applications/uploads/${documentFolderID}/remove`, file);
  }

  submitApplication(scholarshipProgramURL, scholarshipURL) {
    return this.http.post(`${environment.apiDomain}scholarship-programs/${scholarshipProgramURL}/${scholarshipURL}/applications/submit`, {});
  }
}
