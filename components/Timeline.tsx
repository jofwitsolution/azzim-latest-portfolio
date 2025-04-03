"use client";

import { experiences } from "@/lib/data/mock";
import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

const Timeline = () => {
  return (
    <div className="mt-14">
      <VerticalTimeline
        layout="1-column-left"
        lineColor="#C7D2FE"
        className="!m-0"
      >
        {experiences.map((experience) => (
          <VerticalTimelineElement
            key={experience.id}
            className="vertical-timeline-element--work"
            contentStyle={{
              boxShadow: "none",
              paddingTop: 0,
              paddingLeft: 0,
              paddingRight: 0,
            }}
            iconStyle={{
              background: experience.color,
              width: "24px",
              height: "24px",
              marginLeft: "13px",
            }}
          >
            <div className="flex flex-col sm:flex-row gap-2 justify-between mb-3">
              <h3 className="font-semibold text-[17px] text-[1F2937]">
                {experience.job}
              </h3>
              <div className="text-[11.9px]">
                <span>{experience.date}</span>{" "}
                {experience?.jobType && <span>({experience.jobType})</span>}
              </div>
            </div>
            <h4
              style={{ color: experience.color }}
              className="font-medium text-[13.6px] mb-3"
            >
              {experience.company}
            </h4>
            <p className="max-w-[800px]">{experience.role}</p>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
    </div>
  );
};

export default Timeline;
