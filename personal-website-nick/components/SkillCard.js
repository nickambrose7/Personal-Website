'use client'

import React from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css'

export default function SkillCard({
  skillName,
  iconName,
  iconLibrary,
  iconText,
}) {
  const iconClassName =
    iconLibrary === 'devicon' ? `${iconName} colored` : `bi ${iconName}`

  return (
    <div className="skill-card">
      <div className="skill-card-icon" aria-hidden="true">
        {iconText ? (
          <span className="skill-card-icon-text">{iconText}</span>
        ) : (
          <i className={iconClassName}></i>
        )}
      </div>
      <div className="skill-card-body">
        <h3 className="skill-card-title">{skillName}</h3>
      </div>
    </div>
  )
}
