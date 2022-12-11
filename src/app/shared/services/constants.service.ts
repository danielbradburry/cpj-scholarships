import { Injectable } from '@angular/core';

@Injectable()
export class ConstantsService {
  constructor() {}

  storageKey = 'cpj_scholarship_auth_key';
  intendedScholarshipKey = 'cpj_intended_scholarship_key';
  uiDomain = 'https://cpjam.com/';
  scholarshipsDomain = (url) => `https://${url}.scholarships.cpjam.com/`;
  apiError = 'General error communicating with server';

  emailRegExp =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  passwordRegExp = /^.*(?=.{7,})(?=.*\d)(?=.*[a-zA-Z]).*$/;
  httpRegExp =
    /^(https?:\/\/)([\da-zA-Z\.-]+)\.([a-zA-Z\.]{2,7})([\/\w?&~= \.-]*)*\/?$/;
  phoneRegExp = /^([0-9]{10})$/;
  ssnRegExp = /^([0-9]{9})$/;
  zipcodeRegExp = /^([0-9]{5})$/;
  urlFragmentRegExp = /^[a-zA-Z0-9_-]{3,100}$/;

  noUserImage =
    'https://d1nt1hxve4jn1b.cloudfront.net/default-images/users/no-image.jpg';
  noChapterLogo =
    'https://d1nt1hxve4jn1b.cloudfront.net/default-images/chapters/no-logo.jpg';

  yesOrNo = [
    {
      label: 'Yes',
      value: true
    },
    {
      label: 'No',
      value: false
    }
  ];

  defaultTime = '12:00';
  midnight = '00:00';
  lastMinute = '23:59';

  expMonths = [
    {
      label: 'January',
      value: '01'
    },
    {
      label: 'February',
      value: '02'
    },
    {
      label: 'March',
      value: '03'
    },
    {
      label: 'April',
      value: '04'
    },
    {
      label: 'May',
      value: '05'
    },
    {
      label: 'June',
      value: '06'
    },
    {
      label: 'July',
      value: '07'
    },
    {
      label: 'August',
      value: '08'
    },
    {
      label: 'September',
      value: '09'
    },
    {
      label: 'October',
      value: '10'
    },
    {
      label: 'November',
      value: '11'
    },
    {
      label: 'December',
      value: '12'
    }
  ];

  ckConfig = {
    allowedContent: true,
    disallowedContent: 'script',
    toolbarGroups: [
      { name: 'clipboard', groups: ['clipboard', 'undo'] },
      {
        name: 'editing',
        groups: ['find', 'selection', 'spellchecker', 'editing']
      },
      { name: 'forms', groups: ['forms'] },
      { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
      '/',
      {
        name: 'paragraph',
        groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph']
      },
      { name: 'links', groups: ['links'] },
      { name: 'insert', groups: ['insert'] },
      '/',
      { name: 'styles', groups: ['styles'] },
      { name: 'colors', groups: ['colors'] },
      { name: 'tools', groups: ['tools'] },
      { name: 'others', groups: ['others'] },
      { name: 'about', groups: ['about'] },
      { name: 'document', groups: ['mode', 'document', 'doctools'] }
    ],
    removeButtons:
      'Save,Templates,Form,Checkbox,Radio,NewPage,ExportPdf,Preview,Print,TextField,Textarea,Select,Button,ImageButton,HiddenField,Scayt,SelectAll,Find,Replace,CopyFormatting,RemoveFormat,CreateDiv,Language,Image,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Maximize,ShowBlocks,About,BGColor,Flash,PasteFromWord'
  };

  fileTypesAllowed = [
    {
      label: 'Any',
      value: 'all'
    },
    {
      label: 'Images (JPG/PNG) & PDF Only',
      value: 'image-pdf'
    },
    {
      label: 'Images Only (JPG/PNG)',
      value: 'images'
    },
    {
      label: 'PDF Only',
      value: 'pdf'
    }
  ];

  time = [
    { value: '00:00', label: '12:00 AM' },
    { value: '00:15', label: '12:15 AM' },
    { value: '00:30', label: '12:30 AM' },
    { value: '00:45', label: '12:45 AM' },
    { value: '01:00', label: '1:00 AM' },
    { value: '01:15', label: '1:15 AM' },
    { value: '01:30', label: '1:30 AM' },
    { value: '01:45', label: '1:45 AM' },
    { value: '02:00', label: '2:00 AM' },
    { value: '02:15', label: '2:15 AM' },
    { value: '02:30', label: '2:30 AM' },
    { value: '02:45', label: '2:45 AM' },
    { value: '03:00', label: '3:00 AM' },
    { value: '03:15', label: '3:15 AM' },
    { value: '03:30', label: '3:30 AM' },
    { value: '03:45', label: '3:45 AM' },
    { value: '04:00', label: '4:00 AM' },
    { value: '04:15', label: '4:15 AM' },
    { value: '04:30', label: '4:30 AM' },
    { value: '04:45', label: '4:45 AM' },
    { value: '05:00', label: '5:00 AM' },
    { value: '05:15', label: '5:15 AM' },
    { value: '05:30', label: '5:30 AM' },
    { value: '05:45', label: '5:45 AM' },
    { value: '06:00', label: '6:00 AM' },
    { value: '06:15', label: '6:15 AM' },
    { value: '06:30', label: '6:30 AM' },
    { value: '06:45', label: '6:45 AM' },
    { value: '07:00', label: '7:00 AM' },
    { value: '07:15', label: '7:15 AM' },
    { value: '07:30', label: '7:30 AM' },
    { value: '07:45', label: '7:45 AM' },
    { value: '08:00', label: '8:00 AM' },
    { value: '08:15', label: '8:15 AM' },
    { value: '08:30', label: '8:30 AM' },
    { value: '08:45', label: '8:45 AM' },
    { value: '09:00', label: '9:00 AM' },
    { value: '09:15', label: '9:15 AM' },
    { value: '09:30', label: '9:30 AM' },
    { value: '09:45', label: '9:45 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '10:15', label: '10:15 AM' },
    { value: '10:30', label: '10:30 AM' },
    { value: '10:45', label: '10:45 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '11:15', label: '11:15 AM' },
    { value: '11:30', label: '11:30 AM' },
    { value: '11:45', label: '11:45 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '12:15', label: '12:15 PM' },
    { value: '12:30', label: '12:30 PM' },
    { value: '12:45', label: '12:45 PM' },
    { value: '13:00', label: '1:00 PM' },
    { value: '13:15', label: '1:15 PM' },
    { value: '13:30', label: '1:30 PM' },
    { value: '13:45', label: '1:45 PM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '14:15', label: '2:15 PM' },
    { value: '14:30', label: '2:30 PM' },
    { value: '14:45', label: '2:45 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '15:15', label: '3:15 PM' },
    { value: '15:30', label: '3:30 PM' },
    { value: '15:45', label: '3:45 PM' },
    { value: '16:00', label: '4:00 PM' },
    { value: '16:15', label: '4:15 PM' },
    { value: '16:30', label: '4:30 PM' },
    { value: '16:45', label: '4:45 PM' },
    { value: '17:00', label: '5:00 PM' },
    { value: '17:15', label: '5:15 PM' },
    { value: '17:30', label: '5:30 PM' },
    { value: '17:45', label: '5:45 PM' },
    { value: '18:00', label: '6:00 PM' },
    { value: '18:15', label: '6:15 PM' },
    { value: '18:30', label: '6:30 PM' },
    { value: '18:45', label: '6:45 PM' },
    { value: '19:00', label: '7:00 PM' },
    { value: '19:15', label: '7:15 PM' },
    { value: '19:30', label: '7:30 PM' },
    { value: '19:45', label: '7:45 PM' },
    { value: '20:00', label: '8:00 PM' },
    { value: '20:15', label: '8:15 PM' },
    { value: '20:30', label: '8:30 PM' },
    { value: '20:45', label: '8:45 PM' },
    { value: '21:00', label: '9:00 PM' },
    { value: '21:15', label: '9:15 PM' },
    { value: '21:30', label: '9:30 PM' },
    { value: '21:45', label: '9:45 PM' },
    { value: '22:00', label: '10:00 PM' },
    { value: '22:15', label: '10:15 PM' },
    { value: '22:30', label: '10:30 PM' },
    { value: '22:45', label: '10:45 PM' },
    { value: '23:00', label: '11:00 PM' },
    { value: '23:15', label: '11:15 PM' },
    { value: '23:30', label: '11:30 PM' },
    { value: '23:45', label: '11:45 PM' },
    { value: '23:59', label: '11:59 PM' }
  ];

  states = [
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'DC', label: 'District Of Columbia' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' },
    { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' },
    { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'OH', label: 'Ohio' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' },
    { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' },
    { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'WY', label: 'Wyoming' }
  ];
}
