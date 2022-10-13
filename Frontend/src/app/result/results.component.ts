
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { ImageService } from '../_services/image.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  constructor(private imageService:ImageService, private auth:AuthService,private http:HttpClient) { }


  ngOnInit(): void {
    this.auth.canAccess()
  }
  
  imageToShow: any;
  isImageLoading = false;

createImageFromBlob(image: Blob) {
   let reader = new FileReader();
   reader.addEventListener("load", () => {
      this.imageToShow = reader.result;
   }, false);

   if (image) {
      reader.readAsDataURL(image);
   }
}


  onSubmit(){


      this.isImageLoading = true;
      this.imageService.getImage("http://127.0.0.1:5000/results").subscribe({
        next:data=>{
          this.createImageFromBlob(data);
        }
      });
  }


}