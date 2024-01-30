local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.loop.fs_stat(lazypath) then
  vim.fn.system({
    "git",
    "clone",
    "--filter=blob:none",
    "https://github.com/folke/lazy.nvim.git",
    "--branch=stable", -- latest stable release
    lazypath,
  })
end
vim.opt.rtp:prepend(lazypath)

require("lazy").setup({ spec = "plugins", change_detection = { notify = false } })

--[[
require("lazy").setup({
	{
		"catppuccin/nvim",
		config = function()
			vim.cmd.colorscheme("catppuccin")
		end,
	},
	{
		"alexghergh/nvim-tmux-navigation",
		event = "VeryLazy",
		config = function()
			local nvim_tmux_nav = require("nvim-tmux-navigation")
			nvim_tmux_nav.setup({
				disable_when_zoomed = true,
				keybinds = {
					left = "<C-h>",
					down = "<C-j>",
					up = "<C-k>",
					right = "<C-l>",
					last_active = "<C-\\>",
					next = "<C-tab>",
				},
			})
		end,
	},
	{
		"nvim-telescope/telescope.nvim",
		event = "BufReadPre",
		dependencies = {
			{ "nvim-lua/plenary.nvim" },
			{ "nvim-telescope/telescope-fzf-native.nvim", build = "make" },
		},
		keys = {
			{ "<leader>po", "<cmd>lua require('telescope.builtin').find_files()<CR>" },
			{ "<C-p>", "<cmd>lua require('telescope.builtin').git_files()<CR>" },
			{ "<leader>pg", "<cmd>lua require('telescope.builtin').live_grep()<CR>" },
			{ "<leader>ps", "<cmd>lua require('telescope.builtin').current_buffer_fuzzy_find()<cr>" },
		},
		opts = function()
			local actions = require("telescope.actions")
			return {
				pickers = {
					find_files = { hidden = true },
					live_grep = {
						additional_args = function(opts)
							return { "--hidden" }
						end,
					},
				},

				extensions = {
					fzf = {
						fuzzy = true,
						override_generic_sorter = true,
						override_file_sorter = true,
						case_mode = "smart_case",
					},
				},
			}
		end,
		config = function(_, opts)
			local telescope = require("telescope")
			telescope.setup(opts)
			telescope.load_extension("fzf")
		end,
	},
})
]]--
