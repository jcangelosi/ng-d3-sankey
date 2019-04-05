import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { d3sankey } from './sankey';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  selectedElement;

  ngOnInit(): void {
    this.DrawChart();
  }

  private DrawChart() {

    const units = 'Widgets';

    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 10, bottom: 10, left: 10 },
      width = 900 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // format variables
    const formatNumber = d3.format(',.0f'),    // zero decimal places
      format = function (d) { return formatNumber(d) + ' ' + units; },
      color = d3.scaleOrdinal(d3.schemeCategory20);

    // append the svg object to the body of the page
    const svg = d3.select('#sankey');

    // Set the sankey diagram properties
    const sankey = d3sankey()
      .nodeWidth(36)
      .nodePadding(40)
      .size([width, height]);

    const path = sankey.link();

    // load the data
    d3.json('../assets/data.json', function (error, graph) {
      if (error) { throw error; }
      console.log(graph);

      sankey
        .nodes(graph.nodes)
        .links(graph.links)
        .layout(32);

      // add in the links
      const link = svg.append('g').selectAll('.link')
        .data(graph.links)
        .enter().append('path')
        .attr('class', 'link')
        .attr('d', path)
        .style('stroke-width', function (d) { return Math.max(1, d.dy); })
        .sort(function (a, b) { return b.dy - a.dy; });

      // add the link titles
      link.append('title')
        .text(function (d) {
          return d.source.name + ' → ' +
            d.target.name + '\n' + format(d.value);
        });

      // add in the nodes
      const node = svg.append('g').selectAll('.node')
        .data(graph.nodes)
        .enter().append('g')
        .attr('class', 'node')
        .attr('transform', function (d) {
          return 'translate(' + d.x + ',' + d.y + ')';
        })
        .call(d3.drag()
          .subject(function (d) {
            return d;
          })
          .on('start', function () {
            this.parentNode.appendChild(this);
          })
          .on('drag', dragmove));

      // add the rectangles for the nodes
      node.append('rect')
        .attr('height', function (d) { return d.dy; })
        .attr('width', sankey.nodeWidth())
        .style('fill', function (d) {
          return d.color = color(d.name.replace(/ .*/, ''));
        })
        .style('stroke', function (d) {
          return d3.rgb(d.color).darker(2);
        })
        .append('title')
        .text(function (d) {
          return d.name + '\n' + format(d.value);
        });

      // add in the title for the nodes
      node.append('text')
        .attr('x', -6)
        .attr('y', function (d) { return d.dy / 2; })
        .attr('dy', '.35em')
        .attr('text-anchor', 'end')
        .attr('transform', null)
        .text(function (d) { return d.name; })
        .filter(function (d) { return d.x < width / 2; })
        .attr('x', 6 + sankey.nodeWidth())
        .attr('text-anchor', 'start');

      // the function for moving the nodes
      function dragmove(d) {
        d3.select(this).attr('transform',
          'translate(' + (
            d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))
          )
          + ',' + (
            d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
          ) + ')');
        sankey.relayout();
        link.attr('d', path);
      }
    });

    /*       node.append('title')
            .text( (d: any) => d.name + '\n' + format(d.value)); */

    /*       node.append('title').text('holis');
          node.on('mouseover',  (d) => {
            console.log('holis');
          });
          node.on('mousedown', this.startDrag);
          node.on('mousemove', this.drag);
          node.on('mouseup', this.endDrag);
          node.on('mouseleave', this.endDrag);
        }); */
  }

  /*   public test() {
      console.log('test');
    }

    public startDrag(evt); {
  /*     if (evt.target.classList.contains('draggable')) { */
  /*       this.selectedElement = evt;
        console.log(evt); */
  /*     } */
}
/*
  public drag(evt); {
    if (this.selectedElement) {
    }
  }

  public endDrag(evt); {
    this.selectedElement = null;
  } */
