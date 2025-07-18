import { Component } from '@angular/core';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent {
  services = [
    {
      title: 'Web Development',
      description: 'We provide high-quality web development services using modern technologies such as Angular, React, and Vue.js to build responsive, user-friendly websites.',
      icon: 'assets/icons/mobile-development.svg'
    },
    {
      title: 'Mobile App Development',
      description: 'Our mobile app development team specializes in creating high-performance apps for iOS and Android using frameworks like Flutter and React Native.',
      icon: 'assets/icons/mobility-services.svg'
    },
    {
      title: 'SEO Optimization',
      description: 'We help businesses grow online with our SEO optimization services, ensuring that your website ranks higher on search engines and attracts more traffic.',
      icon: 'assets/icons/software-consulting.svg'
    },
    {
      title: 'E-Commerce Solutions',
      description: 'We provide end-to-end e-commerce solutions, including custom stores, payment integrations, and product management systems, to help businesses sell online efficiently.',
      icon: 'assets/icons/software-consulting.svg'
    },
    {
      title: 'Cloud Services',
      description: 'Our cloud solutions offer scalable and secure infrastructure, ensuring seamless hosting, storage, and data management for businesses of all sizes.',
      icon: 'assets/icons/software-consulting.svg'
    },
    {
      title: 'Consulting & Strategy',
      description: 'Our expert consultants offer business strategy and IT consulting to help businesses align their goals with the latest technology solutions.',
      icon: 'assets/icons/software-consulting.svg'
    }
  ];
}

