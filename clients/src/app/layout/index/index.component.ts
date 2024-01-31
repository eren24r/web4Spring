import {AfterViewInit, Component, HostBinding, HostListener, OnInit, signal} from '@angular/core';
import {TokenStorageService} from "../../service/token-storage.service";
import {UserService} from "../../service/user.service";
import {Router} from "@angular/router";
import {User} from "../../models/User";
import {NotificationService} from "../../service/notification.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AreaService} from "../../service/area.service";

import { DatePipe } from '@angular/common';
import {takeUntil} from "rxjs";
import {Area} from "../../models/Area";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout"; // Import DatePipe


declare function on_main_load() : void;
declare function enable_graph(): void;
declare function drawGraphByR(r : number) : void;
declare function drawPointXY(x : number, y : number):void;
declare function drawPointXYRRes(x : number, y : number, r : number, result : boolean) : void;
declare function clearAllPoints() : void;
declare function saveXYRRes(x : number, y : number, r : number, result : boolean) : void;
declare function allXYPoints(): void;

export interface  GraphPoint {
  x: number;
  y: number;
}

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit, AfterViewInit{

  @HostBinding('class.desktop') isDesktop: boolean = false;
  @HostBinding('class.tablet') isTablet: boolean = false;
  @HostBinding('class.mobile') isMobile: boolean = false;

  isLoggedIn = false;
  isUserDataLoaded = false;
  user: any;

  coordinateForm: any;

  xValues = ['-3', '-2', '-1', '0', '1', '2', '3', '4', '5'];
  yMinValue = -3;
  yMaxValue = 5;

  //table
  displayedColumns: string[] = ['x', 'y', 'r', 'res', 'calculationTime', 'calculatedAt'];
  dataSource: any;

  constructor(private dataService: AreaService,
              private fb: FormBuilder,
              private router: Router,
              private tokenService: TokenStorageService,
              private userService: UserService,
              private notificationService: NotificationService
  ) { }

  ngAfterViewInit() {
    // @ts-ignore
    import('../../../assets/js/graph.js').then(() => {
      console.log('File loaded successfully');
      on_main_load();
      enable_graph();
      drawGraphByR(1);
    }).catch(error => {
      console.error('Error loading file', error);
    });
  }

    ngOnInit(): void {
      this.checkScreenSize();

    this.isLoggedIn = !!this.tokenService.getToken();

    this.userService.getCurrentUser()
      .subscribe(data => {
        this.user = data;
        this.isUserDataLoaded = true;
      })


      this.coordinateForm = this.fb.group({
        xCoordinate: ['', Validators.required],
        yCoordinate: [1, [Validators.required, Validators.min(this.yMinValue), Validators.max(this.yMaxValue)]],
        radius: ['', Validators.min(0.1)]
      });

      this.loadAreaData();

      //Updating
      this.coordinateForm.get('radius').valueChanges.subscribe(() => {
        if(this.coordinateForm.get('radius').value >= 0) {
          clearAllPoints();
          drawGraphByR(this.coordinateForm.get('radius').value);
          this.drawPoints();
        }
      });

      this.coordinateForm.get('xCoordinate').valueChanges.subscribe(() => {
        if(this.coordinateForm.get('yCoordinate').value != null){
          drawPointXY(this.coordinateForm.get('xCoordinate').value, this.coordinateForm.get('yCoordinate').value);
        }
      });

      this.coordinateForm.get('yCoordinate').valueChanges.subscribe(() => {
        if(this.coordinateForm.get('xCoordinate').value != null){
          drawPointXY(this.coordinateForm.get('xCoordinate').value, this.coordinateForm.get('yCoordinate').value);
        }
      });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    const screenWidth = window.innerWidth;

    this.isDesktop = screenWidth >= 1153;
    this.isTablet = screenWidth >= 751 && screenWidth < 1153;
    this.isMobile = screenWidth < 751;
  }

  loadAreaData() {
    this.dataService.getAllAreaData().subscribe((data) => {
      this.dataSource = data;

      this.drawPoints();

    });
  }

  drawPoints(): void {
    this.dataSource.forEach((item: Area) => {
      drawPointXYRRes(Number(item.x), Number(item.y), Number(item.r), Boolean(item.res));
    });
  }

  onSubmit() {
    let x = this.coordinateForm.value.xCoordinate;
    let y = this.coordinateForm.value.yCoordinate;
    let r = this.coordinateForm.value.radius;

    this.coordinateForm.disable();

    this.sendToCalc(x,y,r);

  }

  sendToCalc(x:number,y:number,r:number): void{

    this.dataService.calculate(x, y, r).subscribe(
      (response) => {
        if(this.dataSource !== null){
          this.dataSource.push(response);
        }
        else{
          this.dataSource = [response];
        }

        this.notificationService.showSnackBar('Calculation result: ' + response.res);
        drawPointXYRRes(x, y, r, response.res);

        this.coordinateForm.reset({ xCoordinate: x, yCoordinate : y, radius: r });

        this.coordinateForm.enable();
      },
      (error) => {
        this.notificationService.showSnackBar('Error in calculation!');
      });

  }
  onDelete(){
    this.dataService.deleteOn().subscribe(() =>
    {
      this.dataSource = null;
      clearAllPoints();

      drawGraphByR(this.coordinateForm.value.radius);
      drawPointXY(this.coordinateForm.value.xCoordinate, this.coordinateForm.value.yCoordinate);

      this.notificationService.showSnackBar("All items deleted!");

    }, error => {
      console.error('Error deleting item', error);
      this.notificationService.showSnackBar("Error deleting items!");
    })


  }

  @HostListener('window:onGraph', ['$event.detail'])
  onLogin(detail : GraphPoint) {
    this.coordinateForm.disable();
    let x = detail.x
    let y = detail.y;
    let r = this.coordinateForm.value.radius;

    this.sendToCalc(x,y,r);

  }

  logout(): void {
    this.tokenService.logOut();
    this.router.navigate(['/login']);
    this.notificationService.showSnackBar("Logout!");
  }

  formatCalculatedAt(calculatedAt: string): string {
    // Assuming calculatedAt is a Unix timestamp in milliseconds
    let all = calculatedAt.toString().split(',');
    let date =  all.at(3) + ":" + all.at(4) + ":" + all.at(5) + " " + all.at(2) + "/" + all.at(1) + "/" + all.at(0);
    return date;
  }

}
