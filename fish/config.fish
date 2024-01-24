if status is-interactive
    # Commands to run in interactive sessions can go here
end

function bind_bang
    switch (commandline -t)[-1]
        case "!"
            commandline -t -- $history[1]
            commandline -f repaint
        case "*"
            commandline -i !
    end
end

function bind_dollar
    switch (commandline -t)[-1]
        case "!"
            commandline -f backward-delete-char history-token-search-backward
        case "*"
            commandline -i '$'
    end
end

function fish_user_key_bindings
    bind ! bind_bang
    bind '$' bind_dollar
end

alias wcargo="/mnt/c/Users/ccsca/.cargo/bin/cargo.exe"
alias wrustc="/mnt/c/Users/ccsca/.cargo/bin/rustc.exe"
alias wrustup="/mnt/c/Users/ccsca/.cargo/bin/rustup.exe"

alias wgcc="/mnt/c/Users/ccsca/scoop/apps/gcc/current/bin/gcc.exe"
alias wg++="/mnt/c/Users/ccsca/scoop/apps/gcc/current/bin/g++.exe"
