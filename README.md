# 💎👌 Gem Allowlist

This is a prototype example of creating a repository allowlist for gems. If any gem that is not on the allowlist is added in a PR, CI for that PR would fail, warning you about the disallowed gems. 

<img width="788" alt="image" src="https://user-images.githubusercontent.com/8496209/167184810-d1690ad6-24f0-4977-ab29-6804d1600816.png">

This is a PROTOTYPE, only meant to serve as an example and is far from feature complete. This was created as part of a talk for RailsConf 2022 by [@aellispiece](https://github.com/aellispierce) and [@bettymakes](https://github.com/bettymakes). 

# 🛠 How to Use

### 💪 Add the workflow to your repo
To use this action, first add the action to your GitHub worfklows, following [this guide](https://docs.github.com/en/actions/learn-github-actions/finding-and-customizing-actions#adding-an-action-from-a-different-repository).

### 📝 Define your allowlist in a json file
Now you'll need to create an allowlist. By default we look for a list at `./allowlist.json` but feel free to add it to whatever named file you want and you can override that setting later. To this file, add a json formatted list of all of the gem names that you want to allow.

### ✨ Set up your action.yml
Now you can create and set up an action.yml. Here you can override the file you want to validate (`Gemfile` by default) and the file you want to use as your allowlist (`./allowlist.json` by default).

Ours is [here](https://github.com/aellispierce/gem-allowlist-action/blob/main/action.yml) if you'd like an example and for more docs, check out the github action.yml docs [here](https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions).
