import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private http:HttpClient, private auth:AuthService, private route: Router) { }

  ngOnInit(): void {

	this.auth.canAccess();
  }
  files: File[] = [];
  submitted=false;
  

	onSelect(event: { addedFiles: any; }) {
		console.log(event);
		this.files.push(...event.addedFiles);
	}

	onRemove(event: File) {
		console.log(event);
		this.files.splice(this.files.indexOf(event), 1);
	}

	addData(data:{period:string}){

        let testData:FormData = new FormData();
		testData.append('file', this.files[0], this.files[0].name);
		testData.append('period',<string>data.period)
		this.http.post('http://127.0.0.1:5000/predict', testData).subscribe(response => {
			console.log(response)
			this.submitted = true;
    		
		});

		
	}

	onSubmit(data:{period:number}){
		this.http.post('http://127.0.0.1:5000/period',data).subscribe(response=>{
			console.log(response)
			this.route.navigate(['/results']);
			this.submitted = false;
		})
	}

}
