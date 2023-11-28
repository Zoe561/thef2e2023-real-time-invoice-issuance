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

  private determineColor(votes: any): string {
    const maxVotes = Math.max(votes.A, votes.B, votes.C);

    if (maxVotes === +votes.A) return '#8082FF';
    if (maxVotes === +votes.B) return '#F4A76F';
    if (maxVotes === +votes.C) return '#57D2A9';
    else return '';
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

    d3.csv('assets/vote/2020-country-ballot.csv').then(voteData => {
      d3.json('assets/json/twCounty2010merge.topo.json').then((topojsonData: any) => {

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
          .attr('fill', d => {
            const county = (d as any).properties.COUNTYNAME; // 根據您的地圖數據結構調整
            const votes = voteData.find(v => v['county'].trim() === county);
            console.log(county, votes);

            return votes ? this.determineColor(votes) : 'gray';
            // return 'gray';
          }) // 設定填充顏色
          .attr('stroke', 'white') // 設定邊框顏色
          .attr('stroke-width', 2) // 設定邊框寬度
          .attr('class', 'county') // 或者您想要的任何 CSS 類
          .style('cursor', 'pointer') // 加這一行來改變滑鼠指標
          // .append('title') // 加這一行來顯示縣市名稱
          // .text((d: any) => d.properties.name)
          .on('mouseover', function (d, i) {
            d3.select(this).style('opacity', 0.7); // 增加透明度
          })
          .on('mouseout', function (d, i) {
            d3.select(this).style('opacity', 1); // 恢復原有透明度
          });
      });
    });


  }



}
