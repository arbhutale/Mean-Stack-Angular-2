import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;

  constructor(private formBuilder: FormBuilder) { 
    
        this.createForm()
      }


  createForm(){
    this.form = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(30),
        Validators.minLength(5),
        this.validateEmail
      ])],
      username: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(15),
        Validators.minLength(3),
        this.validateUsername
      ])],
      password:['', Validators.compose([
        Validators.required,
        Validators.maxLength(35),
        Validators.minLength(8),
        this.validatePassword
      ])],
      confirm: ['', Validators.required],
    },{ validator: this.matchingPasswords('password', 'confirm')});
  }

  validateEmail(controls) {
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
   if( regExp.test(controls.value)){
     return null;
   }else{
     return {'validateEmail': true }
   }
  }

  validateUsername(controls){
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    if( regExp.test(controls.value)){
      return null;
    }else{
      return {'validateUsername': true }
    }
  }
 
  validatePassword(controls){
    const regExp = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/);
    if( regExp.test(controls.value)){
      return null;
    }else{
      return {'validatePassword': true }
    }
  }

  matchingPasswords(password, confirm){
    return (group: FormGroup)=>{
      if(group.controls[password].value === group.controls[confirm].value){
        return null;
      }else{
        return { 'matchingPasswords': true }
      }
    }
  }

onRegisterSubmit(){
  console.log('form submitted');
}


  ngOnInit() {
  }

}
