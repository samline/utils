---
locale: en
sidebar:
  group: guides
  order: 2
title: 'Accessibility and behavior'
titleAccent: 'behavior'
description: 'Document motion, keyboard interaction, semantics and the accessibility responsibilities shared by the package and the application.'
---

## Responsibilities

Describe what the package guarantees and what the application must supply. Avoid claiming compliance based only on automated checks.

## Keyboard and focus

Use native controls with visible focus, readable labels and a logical order. Test repeated instances and teardown. Modals must retain and restore focus through their owning dependency.

## Motion and state

Respect reduced motion. If examples move, provide a pause control that displays Play while paused and Pause while playing. Do not combine changing action labels with stable-label toggle semantics.

## Layout and contrast

Check both themes from 320 to 1440, then back to 320, with enlarged text. Let controls wrap and grow. Never hide page overflow to conceal a defect. Verify contrast for custom accent colors before publishing.
