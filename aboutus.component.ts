import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.scss']
})
export class AboutusComponent implements OnInit {
  sliderImages: string[] = [];
  activeSlide: number = 2;

  ngOnInit(): void {
    this.sliderImages = [
      './assets/images/image1.jpg',
      './assets/images/image2.jpg',
      './assets/images/image3.jpg',
      './assets/images/image4.jpg',
      './assets/images/image5.jpg',
      './assets/images/image1.jpg',
      './assets/images/image2.jpg',
      './assets/images/image3.jpg',
      './assets/images/image4.jpg',
      './assets/images/image5.jpg',
      './assets/images/image1.jpg',
      './assets/images/image2.jpg',
      './assets/images/image3.jpg',
      './assets/images/image4.jpg',
      './assets/images/image5.jpg'
    ];
  }

  nextSlide() {
    this.activeSlide = (this.activeSlide + 1) % this.sliderImages.length;
  }

  prevSlide() {
    this.activeSlide =
      (this.activeSlide - 1 + this.sliderImages.length) % this.sliderImages.length;
  }
}
