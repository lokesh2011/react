import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormService } from '../form.service';

interface Qualification {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.css']
})
export class ReactiveFormComponent implements OnInit {

  registration: FormGroup;
  

  disableSubmit : boolean = true;

  disableEdit : boolean = false;

  myControl = new FormControl('');

  options: string[] = ["Chennai", "Madurai", "Coimbatore", "Thirunelveli"];

  filteredOptions: Observable<string[]>;

  gap: string[] = ['One', 'Two', 'Three'];

  filtered: Observable<string[]>;

  education: Qualification[] = [
    { value: 'Degree', viewValue: 'Degree' },
    { value: 'Diplomo', viewValue: 'Diplomo' },
    { value: 'HSC', viewValue: 'HSC' },
  ];

  filterEmployee: Observable<{ id: string, name: string }[]>;
  
  employee: { id: string, name: string }[] = [
    { id: "BMS0181", name: "Karthikeyan" },
    { id: "BMS0182", name: "Guru" },
    { id: "BMS0183", name: "Varun" },
    { id: "BMS0184", name: "Arunkumar" },
    { id: "BMS0185", name: "Praveenkumar" },
    { id: "BMS0186", name: "Abilash" },
    { id: "BMS0187", name: "Harikrishnan" },
    { id: "BMS0188", name: "Kishoth" },
    { id: "BMS0189", name: "Ramkumar" },
    { id: "BMS0190", name: "Kiruba" },
  ];

  skills: string[] = ["Java", "Phython", "Php", "Javascript", "HTML", "CSS"];

  location: string[] = ["Chennai", "Madurai", "Virudhunagar", "Thirunelveli", "Thoothukudi", "Coimbatore", "Cuddalore"];

  locationFilter = new FormControl("");

  filter : {value:string, viewValue:string}[] = [
    {value: 'fristname', viewValue: 'Name'},
    {value: 'email', viewValue: 'Email'},
    {value: 'contact', viewValue: 'Contact'},
    {value : 'gender', viewValue : "Gender"},
    {value:"cgap", viewValue : "Carrer Gap"},
  ]

  searchType : string  = "";

  searchVal : string = "";

  selectedImg : any;

  constructor(private formSer: FormService, private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.registration = new FormGroup({

      "fristname": new FormControl("", Validators.required),
      "lastname": new FormControl("",  Validators.required),
      "email": new FormControl("", [Validators.required, Validators.email]),
      "contact": new FormControl("", Validators.required),
      "address": new FormControl("", Validators.required),
      "gender": new FormControl("", Validators.required),
      "dob": new FormControl("", Validators.required),
      "education": new FormControl("", Validators.required),
      "skills": new FormControl("", Validators.required),
      "location": new FormControl("", Validators.required),
      "whatsapp": new FormControl(""),
      "cgap": new FormControl("", Validators.required),
      "time": new FormControl("", Validators.required),
      "condition": new FormControl("", Validators.required),
      "update": new FormControl(""),
      "username" : new FormControl("", Validators.required),
      // "photo" : new FormControl("")
    });

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    this.filterEmployee = this.registration.controls.username.valueChanges.pipe(
      startWith(''),
      map(value => this.filterEmp(value || '')),
    );

    this.filtered = this.registration.controls.cgap.valueChanges.pipe(
      startWith(''),
      map(value => this._filter2(value || '')),
    );

  }

  doRegistor() {
   if(this.registration.valid)
   {
    this.formSer.registorUser(this.registration.value);
    this.registration.reset();
   }
   else
   {
    alert("Invalid Form")
   }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(location => location.toLowerCase().includes(filterValue));
  }

  private filterEmp(value: string): { id: string, name: string }[] {
    const filterValue = value.toLowerCase();

    return this.employee.filter(option => option.id.toLowerCase().startsWith(filterValue) || option.name.toLowerCase().startsWith(filterValue));
  }

  private _filter2(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.gap.filter((gap) => gap.toLowerCase().includes(filterValue));
  }


  get newUsers() {
    if (localStorage.getItem("registor-user")) {
      return JSON.parse(localStorage.getItem("registor-user"))
    }
  }

  deleteUser(i: number) {
    this.formSer.deleteUser(i)
  }

  editUser(i: number) {

    this.disableEdit = true;

    this.disableSubmit = false;

    this.registration = new FormGroup({
      "fristname": new FormControl(this.newUsers[i].fristname),
      "lastname": new FormControl(this.newUsers[i].lastname),
      "email": new FormControl(this.newUsers[i].email),
      "contact": new FormControl(this.newUsers[i].contact),
      "address": new FormControl(this.newUsers[i].address),
      "gender": new FormControl(this.newUsers[i].gender),
      "dob": new FormControl(this.newUsers[i].dob),
      "education": new FormControl(this.newUsers[i].education),
      "skills": new FormControl(this.newUsers[i].skills),
      "location": new FormControl(this.newUsers[i].location),
      "whatsapp": new FormControl(this.newUsers[i].whatsapp),
      "cgap": new FormControl(this.newUsers[i].cgap),
      "time": new FormControl(this.newUsers[i].time),
      "condition": new FormControl(this.newUsers[i].condition),
      "update": new FormControl(this.newUsers[i].update),
      "username" : new FormControl(this.newUsers[i].username),
      "photo" : new FormControl(this.newUsers[i].photo),
      
    });

    this.formSer.getIndexNumber(i) 
  }

  updateUser()
  {
    this.formSer.updateUser(this.registration.value);
    this.registration.reset();
    this.disableEdit = false;
    this.disableSubmit = true;
  }

  selectImg(event:any)
  {
    this.selectedImg = event.target.files[0].name;
  }
}


