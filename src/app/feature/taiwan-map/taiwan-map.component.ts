import { Component, OnInit } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';


@Component({
  selector: 'app-taiwan-map',
  templateUrl: './taiwan-map.component.html',
  styleUrls: ['./taiwan-map.component.scss']
})
export class TaiwanMapComponent implements OnInit {
  svgContent!: SafeHtml;
  country: any;
  constructor(
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.drawMap();
  }

  drawMap(): void {
    const svg = d3.select('svg');
    const path = d3.geoPath();

    // 選擇合適的地圖投影方式
    const projection = d3.geoMercator()
      .center([120, 23.5])
      .translate([900 / 2, 900 / 2])  // 設置地圖在 SVG 容器中的位置
      .scale(12000);
    const pathGenerator = path.projection(projection) as any;

    d3.json('assets/json/twCounty2010.topo.json').then((topojsonData: any) => {

      // topoJson to GeoJSON
      const geojsonData = topojson.feature(topojsonData, topojsonData.objects.layer1) as any;

      svg.selectAll('path')
        .data(
          geojsonData.features,

        )
        .enter()
        .append('path')
        // 使用 D3 的地理路徑生成器來設置 'd' 屬性
        .attr('d', path as any)
        .attr('fill', 'gray') // 設定填充顏色
        .attr('class', 'country') // 或者您想要的任何 CSS 類
        .style('cursor', 'pointer') // 加這一行來改變滑鼠指標
        .on('mouseover', function (d, i) {
          d3.select(this).style('fill', 'blue'); // 只改變當前 hover 的 path 元素
        })
        .on('mouseout', function (d, i) {
          d3.select(this).style('fill', 'gray'); // 返回到原始顏色
        });
    });
  }



}
